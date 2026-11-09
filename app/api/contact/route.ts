import { NextRequest, NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()./ -]*$/;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 3;
const MAX_RATE_LIMIT_ENTRIES = 10_000;

const rateLimitEntries = new Map<string, number[]>();

type ContactConfiguration = {
  allowedOrigin: string;
  googleClientId: string;
  googleClientSecret: string;
  googleRefreshToken: string;
  recipientEmail: string;
  senderEmail: string;
  turnstileSecretKey: string;
};

type ContactSubmission = {
  email: string;
  message: string;
  phone: string;
  turnstileToken: string;
};

type AccessToken = {
  expiresAt: number;
  value: string;
};

let accessToken: AccessToken | undefined;

class ContactServiceError extends Error {
  constructor(readonly service: "captcha" | "email") {
    super(service);
  }
}

function response(message: string, status: number) {
  return NextResponse.json(
    { message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

function isEmail(value: string) {
  return value.length <= 320 && EMAIL_PATTERN.test(value);
}

function getConfiguration(): ContactConfiguration | undefined {
  const configuration = {
    allowedOrigin: process.env.CONTACT_ALLOWED_ORIGIN,
    googleClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    googleRefreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    recipientEmail: process.env.CONTACT_RECIPIENT_EMAIL,
    senderEmail: process.env.CONTACT_SENDER_EMAIL,
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY,
  };
  const missing = Object.entries(configuration)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error("Contact form is missing required configuration.", { missing });
    return undefined;
  }

  const {
    allowedOrigin: configuredAllowedOrigin,
    googleClientId,
    googleClientSecret,
    googleRefreshToken,
    recipientEmail,
    senderEmail,
    turnstileSecretKey,
  } = configuration;

  if (
    !configuredAllowedOrigin ||
    !googleClientId ||
    !googleClientSecret ||
    !googleRefreshToken ||
    !recipientEmail ||
    !senderEmail ||
    !turnstileSecretKey
  ) {
    return undefined;
  }

  if (
    !isEmail(recipientEmail) ||
    !isEmail(senderEmail)
  ) {
    console.error("Contact form has an invalid configured email address.");
    return undefined;
  }

  try {
    const allowedOrigin = new URL(configuredAllowedOrigin).origin;

    if (
      process.env.NODE_ENV === "production" &&
      !allowedOrigin.startsWith("https://")
    ) {
      console.error("Contact form requires an HTTPS allowed origin in production.");
      return undefined;
    }

    return {
      allowedOrigin,
      googleClientId,
      googleClientSecret,
      googleRefreshToken,
      recipientEmail,
      senderEmail,
      turnstileSecretKey,
    };
  } catch {
    console.error("Contact form has an invalid allowed origin.");
    return undefined;
  }
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim();

  return ip && /^[0-9a-f:.]+$/i.test(ip) ? ip : "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  if (rateLimitEntries.size >= MAX_RATE_LIMIT_ENTRIES) {
    for (const [entryIp, timestamps] of rateLimitEntries) {
      const lastTimestamp = timestamps.at(-1);

      if (lastTimestamp === undefined || lastTimestamp < cutoff) {
        rateLimitEntries.delete(entryIp);
      }
    }
  }

  if (rateLimitEntries.size >= MAX_RATE_LIMIT_ENTRIES && !rateLimitEntries.has(ip)) {
    return true;
  }

  const timestamps = (rateLimitEntries.get(ip) ?? []).filter(
    (timestamp) => timestamp >= cutoff,
  );

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitEntries.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  rateLimitEntries.set(ip, timestamps);
  return false;
}

function getString(value: unknown, maximumLength: number) {
  if (typeof value !== "string" || value.length > maximumLength) {
    return undefined;
  }

  return value.trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getSubmission(payload: unknown): ContactSubmission | undefined {
  if (!isRecord(payload)) {
    return undefined;
  }

  const email = getString(payload.email, 320)?.toLowerCase();
  const phone = getString(payload.phone, 50);
  const message = getString(payload.message, 4_000)?.replace(/\r\n?/g, "\n");
  const turnstileToken = getString(payload.turnstileToken, 2_048);
  const honeypot = getString(payload.website, 200);

  if (
    !email ||
    !isEmail(email) ||
    !phone ||
    !PHONE_PATTERN.test(phone) ||
    !message ||
    message.length < 20 ||
    !turnstileToken ||
    /[\r\n\u0000]/.test(turnstileToken) ||
    honeypot
  ) {
    return undefined;
  }

  return { email, message, phone, turnstileToken };
}

async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp: string,
) {
  const body = new URLSearchParams({
    secret,
    response: token,
    idempotency_key: crypto.randomUUID(),
  });

  if (remoteIp !== "unknown") {
    body.set("remoteip", remoteIp);
  }

  let turnstileResponse: Response;

  try {
    turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    console.error("Turnstile verification request failed.");
    throw new ContactServiceError("captcha");
  }

  let result: unknown;

  try {
    result = await turnstileResponse.json();
  } catch {
    console.error("Turnstile returned an invalid response.", {
      status: turnstileResponse.status,
    });
    throw new ContactServiceError("captcha");
  }

  if (
    !turnstileResponse.ok ||
    !isRecord(result) ||
    result.success !== true
  ) {
    console.error("Turnstile rejected a contact submission.", {
      status: turnstileResponse.status,
    });
    return false;
  }

  return true;
}

async function getGoogleAccessToken(configuration: ContactConfiguration) {
  if (accessToken && accessToken.expiresAt > Date.now() + 60_000) {
    return accessToken.value;
  }

  let tokenResponse: Response;

  try {
    tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: configuration.googleClientId,
        client_secret: configuration.googleClientSecret,
        grant_type: "refresh_token",
        refresh_token: configuration.googleRefreshToken,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    console.error("Google OAuth token request failed.");
    throw new ContactServiceError("email");
  }

  let tokenPayload: unknown;

  try {
    tokenPayload = await tokenResponse.json();
  } catch {
    console.error("Google OAuth returned an invalid response.", {
      status: tokenResponse.status,
    });
    throw new ContactServiceError("email");
  }

  if (
    !tokenResponse.ok ||
    !isRecord(tokenPayload) ||
    typeof tokenPayload.access_token !== "string" ||
    typeof tokenPayload.expires_in !== "number"
  ) {
    console.error("Google OAuth token request was rejected.", {
      status: tokenResponse.status,
    });
    throw new ContactServiceError("email");
  }

  accessToken = {
    value: tokenPayload.access_token,
    expiresAt: Date.now() + tokenPayload.expires_in * 1_000,
  };

  return accessToken.value;
}

function encodeMessage(message: string) {
  return Buffer.from(message, "utf8").toString("base64url");
}

function createEmailMessage(
  submission: ContactSubmission,
  configuration: ContactConfiguration,
) {
  const subject = Buffer.from(
    "Új kapcsolatfelvételi üzenet",
    "utf8",
  ).toString("base64");
  const content = [
    `From: Nemzeti Technokrata Muhely <${configuration.senderEmail}>`,
    `To: ${configuration.recipientEmail}`,
    `Reply-To: ${submission.email}`,
    `Subject: =?UTF-8?B?${subject}?=`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    `E-mail: ${submission.email}`,
    `Telefonszám: ${submission.phone || "nincs megadva"}`,
    "",
    "Üzenet:",
    submission.message,
    "",
  ].join("\r\n");

  return encodeMessage(content);
}

async function sendEmail(
  submission: ContactSubmission,
  configuration: ContactConfiguration,
) {
  const token = await getGoogleAccessToken(configuration);
  let gmailResponse: Response;

  try {
    gmailResponse = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raw: createEmailMessage(submission, configuration),
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    console.error("Gmail API send request failed.");
    throw new ContactServiceError("email");
  }

  if (!gmailResponse.ok) {
    console.error("Gmail API rejected a contact message.", {
      status: gmailResponse.status,
    });
    throw new ContactServiceError("email");
  }
}

export async function POST(request: NextRequest) {
  const configuration = getConfiguration();

  if (!configuration) {
    return response(
      "A kapcsolatfelvétel jelenleg nem elérhető. Próbálja meg később.",
      503,
    );
  }

  if (request.headers.get("origin") !== configuration.allowedOrigin) {
    return response("Érvénytelen kérés.", 403);
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return response("Érvénytelen kérés.", 415);
  }

  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > 10_000) {
    return response("Az üzenet túl hosszú.", 413);
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return response("Érvénytelen kérés.", 400);
  }

  const submission = getSubmission(payload);

  if (!submission) {
    return response(
      "Kérjük, ellenőrizze a megadott adatokat és az üzenet hosszát.",
      400,
    );
  }

  if (isRateLimited(getClientIp(request))) {
    return response(
      "Túl sok üzenetet küldött. Kérjük, próbálja meg később.",
      429,
    );
  }

  try {
    const captchaValid = await verifyTurnstile(
      submission.turnstileToken,
      configuration.turnstileSecretKey,
      getClientIp(request),
    );

    if (!captchaValid) {
      return response(
        "A biztonsági ellenőrzés nem sikerült. Kérjük, próbálja újra.",
        400,
      );
    }

    await sendEmail(submission, configuration);
  } catch (error) {
    if (error instanceof ContactServiceError) {
      return response(
        "Az üzenet küldése nem sikerült. Kérjük, próbálja meg később.",
        502,
      );
    }

    throw error;
  }

  return response("Köszönjük! Az üzenetét sikeresen elküldtük.", 200);
}

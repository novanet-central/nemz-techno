"use client";

import Script from "next/script";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

type ContactFormProps = {
  turnstileSiteKey?: string;
};

type FormStatus = "error" | "idle" | "success";

type TurnstileApi = {
  remove: (widgetId: string) => void;
  render: (
    container: HTMLElement,
    options: {
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      sitekey: string;
    },
  ) => string;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const initialStatusMessage =
  "Az üzenetet kizárólag kapcsolatfelvételi célból, e-mailben továbbítjuk; adatbázisba nem mentjük.";

export function ContactForm({ turnstileSiteKey }: ContactFormProps) {
  const turnstileContainer = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTurnstileLoaded, setIsTurnstileLoaded] = useState(
    () => typeof window !== "undefined" && Boolean(window.turnstile),
  );
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState(initialStatusMessage);
  const [turnstileToken, setTurnstileToken] = useState("");

  const renderTurnstile = useCallback(() => {
    if (
      !turnstileSiteKey ||
      !isTurnstileLoaded ||
      !turnstileContainer.current ||
      turnstileWidgetId.current ||
      !window.turnstile
    ) {
      return;
    }

    turnstileWidgetId.current = window.turnstile.render(
      turnstileContainer.current,
      {
        sitekey: turnstileSiteKey,
        callback: (token) => {
          setTurnstileToken(token);
          setStatus("idle");
          setStatusMessage(initialStatusMessage);
        },
        "expired-callback": () => {
          setTurnstileToken("");
          setStatus("error");
          setStatusMessage(
            "A biztonsági ellenőrzés lejárt. Kérjük, végezze el újra.",
          );
        },
        "error-callback": () => {
          setTurnstileToken("");
          setStatus("error");
          setStatusMessage(
            "A biztonsági ellenőrzés nem tölthető be. Kérjük, próbálja meg később.",
          );
        },
      },
    );
  }, [isTurnstileLoaded, turnstileSiteKey]);

  useEffect(() => {
    renderTurnstile();

    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = undefined;
      }
    };
  }, [renderTurnstile]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!turnstileToken) {
      setStatus("error");
      setStatusMessage("Kérjük, végezze el a biztonsági ellenőrzést.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setStatus("idle");
    setStatusMessage("Üzenet küldése folyamatban…");

    try {
      const request = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
          website: formData.get("website"),
          turnstileToken,
        }),
      });
      const payload: unknown = await request.json();
      const message =
        typeof payload === "object" &&
        payload !== null &&
        "message" in payload &&
        typeof payload.message === "string"
          ? payload.message
          : "Az üzenet küldése nem sikerült. Kérjük, próbálja meg később.";

      if (!request.ok) {
        setStatus("error");
        setStatusMessage(message);
        return;
      }

      form.reset();
      setTurnstileToken("");
      setStatus("success");
      setStatusMessage(message);

      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
    } catch {
      setStatus("error");
      setStatusMessage("Az üzenet küldése nem sikerült. Kérjük, próbálja meg később.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const formAvailable = Boolean(turnstileSiteKey);

  return (
    <>
      {formAvailable && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setIsTurnstileLoaded(true)}
          onError={() => {
            setStatus("error");
            setStatusMessage(
              "A biztonsági ellenőrzés nem tölthető be. Kérjük, próbálja meg később.",
            );
          }}
        />
      )}
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-fields">
          <label htmlFor="contact-email">
            E-MAIL CÍM
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="nev@pelda.hu"
              autoComplete="email"
              maxLength={320}
              required
            />
          </label>
          <label htmlFor="contact-phone">
            TELEFONSZÁM
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              placeholder="+36 30 123 4567"
              autoComplete="tel"
              maxLength={50}
              required
            />
          </label>
          <label className="contact-message" htmlFor="contact-message">
            ÜZENET
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              minLength={20}
              maxLength={4_000}
              required
            />
          </label>
          <label className="contact-honeypot" htmlFor="contact-website">
            WEBOLDAL
            <input
              id="contact-website"
              name="website"
              type="text"
              autoComplete="off"
              tabIndex={-1}
            />
          </label>
        </div>
        <div
          ref={turnstileContainer}
          className="turnstile-widget"
          aria-label="Biztonsági ellenőrzés"
        />
        <div className="contact-form-footer">
          <p className="contact-form-status" aria-live="polite" data-status={status}>
            {formAvailable ? statusMessage : "A kapcsolatfelvétel jelenleg nem elérhető."}
          </p>
          <button type="submit" disabled={!formAvailable || !turnstileToken || isSubmitting}>
            {isSubmitting ? "KÜLDÉS…" : "ÜZENET KÜLDÉSE"} <span>→</span>
          </button>
        </div>
      </form>
    </>
  );
}

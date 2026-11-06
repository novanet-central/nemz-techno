"use server";

import { createClient } from "@supabase/supabase-js";

type NewsletterSubscriptionState = {
  message: string;
  status: "error" | "idle" | "success";
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToNewsletter(
  _previousState: NewsletterSubscriptionState,
  formData: FormData,
): Promise<NewsletterSubscriptionState> {
  const submittedEmail = formData.get("email");

  if (typeof submittedEmail !== "string") {
    return {
      message: "Adjon meg egy érvényes e-mail címet.",
      status: "error",
    };
  }

  const email = submittedEmail.trim().toLowerCase();

  if (email.length > 320 || !EMAIL_PATTERN.test(email)) {
    return {
      message: "Adjon meg egy érvényes e-mail címet.",
      status: "error",
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Newsletter subscription is not configured.");
    return {
      message: "A feliratkozás jelenleg nem elérhető. Próbálja meg később.",
      status: "error",
    };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  const { error } = await supabase
    .from("technocrat_subs")
    .upsert({ email }, { ignoreDuplicates: true, onConflict: "email" });

  if (error) {
    console.error("Newsletter subscription failed.", { code: error.code });
    return {
      message: "A feliratkozás nem sikerült. Próbálja meg később.",
      status: "error",
    };
  }

  return {
    message: "Sikeresen feliratkozott az értesítésekre.",
    status: "success",
  };
}

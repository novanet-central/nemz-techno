"use client";

import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

const initialNewsletterSubscriptionState = {
  message: "",
  status: "idle" as const,
};

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(
    subscribeToNewsletter,
    initialNewsletterSubscriptionState,
  );

  return (
    <form action={formAction} className="subscribe-form">
      <label htmlFor="newsletter-email">KAPJON ÉRTESÍTÉST AZ ÚJ PUBLIKÁCIÓKRÓL</label>
      <div>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="E-mail cím"
          autoComplete="email"
          maxLength={320}
          required
        />
        <button type="submit" disabled={isPending} aria-label="Feliratkozás">
          {isPending ? "…" : "→"}
        </button>
      </div>
      <p className="newsletter-form-status" aria-live="polite" data-status={state.status}>
        {state.message || "A feliratkozással elfogadja az adatkezelési tájékoztatót."}
      </p>
    </form>
  );
}

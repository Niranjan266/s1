"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    const form = event.currentTarget;
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const result = await response.json() as { error?: string };
    setBusy(false);
    if (response.ok) {
      form.reset();
      setStatus("Message sent. Thank you.");
    } else {
      setStatus(result.error || "Could not send your message.");
    }
  };

  return <form onSubmit={submit} className="contact-form pointer-events-auto" aria-label="Contact form">
    <div className="contact-form__row">
      <label><span>Name</span><input name="name" required minLength={2} maxLength={100} /></label>
      <label><span>Email</span><input name="email" type="email" required /></label>
    </div>
    <label className="hidden" aria-hidden><span>Company</span><input name="company" tabIndex={-1} autoComplete="off" /></label>
    <label><span>Message</span><textarea name="message" required minLength={10} maxLength={5000} rows={4} /></label>
    <div className="contact-form__footer">
      <button type="submit" className="frost-btn frost-btn--primary" disabled={busy}>{busy ? "Sending…" : "Send message"}</button>
      {status && <p role="status">{status}</p>}
    </div>
  </form>;
}

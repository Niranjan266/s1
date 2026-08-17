import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { decryptSmtp, loadStoredPortfolio } from "@/lib/portfolio-storage";

const attempts = new Map<string, number>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const lastAttempt = attempts.get(ip) || 0;
  if (Date.now() - lastAttempt < 30_000) return NextResponse.json({ error: "Please wait before sending another message." }, { status: 429 });
  const body = (await request.json().catch(() => null)) as { name?: string; email?: string; message?: string; company?: string } | null;
  if (body?.company) return NextResponse.json({ ok: true });
  const name = body?.name?.trim() || "";
  const email = body?.email?.trim() || "";
  const message = body?.message?.trim() || "";
  if (name.length < 2 || name.length > 100 || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10 || message.length > 5000) {
    return NextResponse.json({ error: "Please complete every field with valid details." }, { status: 400 });
  }
  try {
    const stored = await loadStoredPortfolio();
    const smtp = decryptSmtp(stored?.smtp);
    if (!smtp?.host || !smtp.user || !smtp.password || !smtp.toEmail) throw new Error("Contact email is not configured yet.");
    const transport = nodemailer.createTransport({ host: smtp.host, port: smtp.port, secure: smtp.secure, auth: { user: smtp.user, pass: smtp.password } });
    await transport.sendMail({
      from: smtp.fromEmail || smtp.user,
      to: smtp.toEmail,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    attempts.set(ip, Date.now());
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Message could not be sent." }, { status: 503 });
  }
}

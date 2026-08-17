import { NextResponse } from "next/server";
import { isAdmin, isSameOrigin } from "@/lib/admin-auth";
import { DEFAULT_PORTFOLIO, toEnglishOnly, type PortfolioConfig, type SmtpConfig } from "@/lib/portfolio-config";
import { decryptSmtp, hasBlobStorage, loadStoredPortfolio, savePortfolio } from "@/lib/portfolio-storage";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const stored = await loadStoredPortfolio();
  let smtp: SmtpConfig | undefined;
  try { smtp = decryptSmtp(stored?.smtp); } catch { smtp = undefined; }
  return NextResponse.json({
    portfolio: toEnglishOnly(stored?.portfolio ?? DEFAULT_PORTFOLIO),
    smtp: smtp ?? { host: "smtp.gmail.com", port: 465, secure: true, user: "", password: "", fromEmail: "", toEmail: "" },
    storageConfigured: hasBlobStorage(),
    updatedAt: stored?.updatedAt ?? null,
  });
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { portfolio?: PortfolioConfig; smtp?: SmtpConfig } | null;
  if (!body?.portfolio?.profile?.name || !Array.isArray(body.portfolio.projects) || !Array.isArray(body.portfolio.experiences)) {
    return NextResponse.json({ error: "The portfolio data is incomplete." }, { status: 400 });
  }
  try {
    await savePortfolio(body.portfolio, body.smtp);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save." }, { status: 500 });
  }
}

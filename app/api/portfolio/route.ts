import { NextResponse } from "next/server";
import { loadPortfolio } from "@/lib/portfolio-storage";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await loadPortfolio(), {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}

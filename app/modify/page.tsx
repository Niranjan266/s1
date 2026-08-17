import type { Metadata } from "next";
import AdminPanel from "@/components/admin/AdminPanel";
import { isAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Portfolio Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ModifyPage() {
  return <AdminPanel initiallyAuthenticated={await isAdmin()} />;
}

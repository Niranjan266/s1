import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdmin, isSameOrigin } from "@/lib/admin-auth";
import { hasBlobStorage } from "@/lib/portfolio-storage";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/x-icon", "image/vnd.microsoft.icon", "image/svg+xml", "application/pdf"];
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  if (!hasBlobStorage()) return NextResponse.json({ error: "Connect a Vercel Blob store first." }, { status: 503 });
  const body = (await request.json().catch(() => null)) as HandleUploadBody | null;
  if (!body) return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });

  // Vercel Blob calls this endpoint after an upload completes. Authentication
  // is required when issuing a browser upload token; the SDK validates the
  // signed completion callback itself.
  if (body.type === "blob.generate-client-token") {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("portfolio/uploads/")) throw new Error("Invalid upload path.");
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_UPLOAD_SIZE,
          addRandomSuffix: false,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400 });
  }
}

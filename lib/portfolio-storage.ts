import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { get, put } from "@vercel/blob";
import {
  DEFAULT_PORTFOLIO,
  toEnglishOnly,
  type PortfolioConfig,
  type SmtpConfig,
  type StoredPortfolio,
} from "@/lib/portfolio-config";

const CONFIG_PATH = "portfolio/config.json";

const blobToken = () => process.env.BLOB_READ_WRITE_TOKEN;

export const hasBlobStorage = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const encryptionKey = () => {
  const value = process.env.ADMIN_DATA_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("ADMIN_DATA_SECRET is not configured");
  return createHash("sha256").update(value).digest();
};

export function encryptSmtp(config: SmtpConfig): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(config), "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString("base64url")).join(".");
}

export function decryptSmtp(value?: string): SmtpConfig | undefined {
  if (!value) return undefined;
  const [iv, tag, encrypted] = value.split(".").map((part) => Buffer.from(part, "base64url"));
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return JSON.parse(Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8")) as SmtpConfig;
}

export async function loadStoredPortfolio(): Promise<StoredPortfolio | null> {
  if (!hasBlobStorage()) return null;
  try {
    // Most Vercel Blob stores are public-access stores. The portfolio content
    // is public by nature, while the only secret (SMTP) is AES-GCM encrypted
    // before it reaches Blob.
    const result = await get(CONFIG_PATH, {
      access: "public",
      useCache: false,
      token: blobToken(),
    });
    if (!result || result.statusCode !== 200) return null;
    return JSON.parse(await new Response(result.stream).text()) as StoredPortfolio;
  } catch (error) {
    if (error instanceof Error && /(not found|404)/i.test(error.message)) return null;
    throw error;
  }
}

export async function loadPortfolio(): Promise<PortfolioConfig> {
  return toEnglishOnly((await loadStoredPortfolio())?.portfolio ?? DEFAULT_PORTFOLIO);
}

export async function savePortfolio(portfolio: PortfolioConfig, smtp?: SmtpConfig): Promise<void> {
  if (!hasBlobStorage()) throw new Error("Connect a Vercel Blob store before saving changes.");
  const previous = await loadStoredPortfolio();
  const record: StoredPortfolio = {
    portfolio: toEnglishOnly(portfolio),
    smtp: smtp ? encryptSmtp(smtp) : previous?.smtp,
    updatedAt: new Date().toISOString(),
  };
  await put(CONFIG_PATH, JSON.stringify(record), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
    token: blobToken(),
  });
}

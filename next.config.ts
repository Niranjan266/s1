import type { NextConfig } from "next";

// Security headers applied to every response. Tuned for a public portfolio:
//   - HSTS forces HTTPS on future visits (the reverse proxy / Traefik handles
//     the actual TLS — this locks browsers in once they've seen one response).
//   - DENY framing prevents clickjacking.
//   - nosniff stops MIME-type confusion attacks.
//   - strict-origin-when-cross-origin limits what the Referer leaks.
//   - Permissions-Policy closes browser APIs we don't use so a future
//     dependency update can't silently start using them.
// CSP intentionally omitted for now — it tends to break Next.js inline
// hydration scripts and Tailwind's injected styles without careful tuning.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

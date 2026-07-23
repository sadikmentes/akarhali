import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Self-contained build output for Node/VPS hosting (Hostinger, Railway, Render).
  output: "standalone",
  // The SQLite db isn't imported by any route, so Next's file tracer won't
  // pick it up on its own — force it into .next/standalone/prisma/dev.db so
  // platforms that deploy only the standalone output (e.g. Hostinger) still
  // ship a working database file.
  outputFileTracingIncludes: {
    "/**": ["./prisma/dev.db"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default withNextIntl(nextConfig);

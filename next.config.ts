import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      // Flexible: allow any https image host
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

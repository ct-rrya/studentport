import type { NextConfig } from "next";

// using postcss tailwind plugin instead of experimental turbopack css loader
const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.ctu.edu.ph",
      },
      {
        protocol: "https",
        hostname: "*.ctu.edu.ph",
      },
    ],
  },
};

export default nextConfig;

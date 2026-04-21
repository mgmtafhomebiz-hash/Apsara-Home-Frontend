import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa");

const nextConfig = {
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "1000logos.net",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
      {
        protocol: "https",
        hostname: "download.logo.wine",
      },
    ],
  },
} satisfies NextConfig & { pwa: object };

const isProduction = process.env.NODE_ENV === "production";

export default isProduction
  ? withPWA({
      ...nextConfig,
      pwa: {
        dest: "public",
        disable: false,
        register: true,
        skipWaiting: true,
      },
    })
  : nextConfig;

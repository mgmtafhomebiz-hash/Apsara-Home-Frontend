import type { NextConfig } from "next";

const withPWA = require("next-pwa");

const nextConfig: NextConfig = {
  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = {
        ignored: [
          "**/DumpStack.log.tmp",
          "**/hiberfil.sys",
          "**/pagefile.sys",
          "**/swapfile.sys",
        ],
      };
    }

    return config;
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
};

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

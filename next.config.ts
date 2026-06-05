import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "tamper-bash-reshape.ngrok-free.dev",
    "d6d2-185-115-6-86.ngrok-free.app",
  ],
  images: {
    qualities: [50, 75, 80, 90, 100],
  },
};

export default nextConfig;

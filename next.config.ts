import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Client-uploaded files are served from the /api/media route.
    localPatterns: [{ pathname: "/images/**" }, { pathname: "/api/media/**" }],
  },
};

export default nextConfig;

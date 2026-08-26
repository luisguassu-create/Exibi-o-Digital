import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    urlImports: true,
  },
  reactCompiler: true,
  images: {
    qualities: [75, 80],
  },
};

export default nextConfig;


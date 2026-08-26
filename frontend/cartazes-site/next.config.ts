import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    urlImports: ['https://framerusercontent.com/'],
  },
  reactCompiler: true,
  images: {
    qualities: [75, 80],
  },
};

export default nextConfig;


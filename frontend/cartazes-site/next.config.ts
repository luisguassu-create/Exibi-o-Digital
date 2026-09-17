import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */

    experimental: {
        urlImports: true,
    },

    reactCompiler: true,

    images: {
        qualities: [75, 80],
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "3001",
                pathname: "/uploads/**",
            },
        ],
    },
};

export default nextConfig;
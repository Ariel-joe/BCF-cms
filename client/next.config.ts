import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    eslint: {
        // Skip ESLint during production builds on Vercel.
        // This lets the build proceed while you fix lint errors.
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["newsapi.org"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.bisnis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "asset.kompas.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn1-production-images-kly.akamaized.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "akcdn.detik.net.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ml.globenewswire.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    outputFileTracingExcludes: {
      '/api/**/*': ['./node_modules/@prisma/engines/**/*'],
    },
  },
  env: {
    NEWSAPI_KEY: process.env.NEWSAPI_KEY,
  },
};

module.exports = nextConfig;

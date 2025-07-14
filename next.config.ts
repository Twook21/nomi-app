/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
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
    ],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placehold.co'], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
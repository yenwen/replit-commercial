// next.config.js

module.exports = {
  // Other configurations...
  // Remove the experimental.serverActions option
};
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ]
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

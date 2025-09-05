/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'generated-app.replit.app'],
  },
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // PWA Configuration
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      }
    ]
  },

  // Environment variables for client
  env: {
    NEXT_PUBLIC_APP_NAME: 'RMCBuddy',
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },

  // Image optimization for YouTube thumbnails
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com']
  }
}

module.exports = nextConfig

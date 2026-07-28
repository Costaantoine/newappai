/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'supabaseolharosol.newappai.com',
      },
      {
        protocol: 'https',
        hostname: 'www.soundhelix.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.freesound.org',
      },
      {
        protocol: 'https',
        hostname: 'files.catbox.moe',
      },
    ],
  },
  generateBuildId: async () => `build-${Date.now()}`,
  output: 'standalone',
}

module.exports = nextConfig

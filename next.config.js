/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'images.unsplash.com',
      'example.com',
      'www.soundhelix.com',
      'cdn.freesound.org',
      'files.catbox.moe',
    ],
  },
  generateBuildId: async () => `build-${Date.now()}`,
}



module.exports = nextConfig


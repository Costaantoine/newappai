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
  generateBuildId: () => 'version-premium-final-1',
}


module.exports = nextConfig


/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repository = 'bietnetwork.org';
const nextConfig = {
  reactStrictMode: true,
  // For GitHub Pages deployment
  basePath: isProd ? `/${repository}` : '',
  assetPrefix: isProd ? `/${repository}/` : '',
  // Ensure CSS and other static assets are properly loaded
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig

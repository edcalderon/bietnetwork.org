/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repository = 'bietnetwork.org';

const nextConfig = {
  reactStrictMode: true,
  // Only enable static export for production
  ...(isProd ? { output: 'export' } : {}),
  // For GitHub Pages deployment
  basePath: isProd ? `/${repository}` : '',
  assetPrefix: isProd ? `/${repository}/` : '',
  // Ensure CSS and other static assets are properly loaded
  images: {
    unoptimized: true,
  },
  // Ensure static assets are properly served
  trailingSlash: true,
  // Add custom webpack config for asset loading
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }
    return config;
  },
  // Fix for static export
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repository}` : '',
  },
};

// For GitHub Pages
if (isProd) {
  nextConfig.assetPrefix = `/${repository}/`;
  nextConfig.basePath = `/${repository}`;
}

module.exports = nextConfig;

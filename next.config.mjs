// @ts-check

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repository = 'bietnetwork.org';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  // For GitHub Pages deployment
  basePath: isProd ? `/${repository}` : '',
  assetPrefix: isProd ? `/${repository}/` : '',
  // Ensure CSS and other static assets are properly loaded
  images: {
    unoptimized: true,
  },
  // Fix for CSS loading
  experimental: {
  // Ensure static assets are properly served
  trailingSlash: true,
  // Add custom webpack config for asset loading
  webpack: (/** @type {any} */ config) => {
    // Fixes npm packages that depend on `fs` module
    if (config.resolve) {
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

export default nextConfig;

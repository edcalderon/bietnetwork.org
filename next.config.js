/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repository = 'bietnetwork.org';

// Set base path and asset prefix for GitHub Pages
const basePath = isGithubActions ? `/${repository}` : '';
const assetPrefix = isGithubActions ? `/${repository}/` : '';

const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Always enable static export for GitHub Pages
  basePath: basePath,
  assetPrefix: assetPrefix,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  // Ensure static export works with GitHub Pages
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;

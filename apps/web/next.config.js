/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repository = 'bietnetwork.org';

// For GitHub Pages, we need to use the repository name as base path
const basePath = isGithubActions ? `/${repository}` : '';
const assetPrefix = isGithubActions ? `/${repository}` : '';

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during builds to allow deployment
    ignoreDuringBuilds: true,
  },
  // Only use static export for GitHub Actions builds, not development
  output: isGithubActions ? 'export' : undefined,
  distDir: 'docs', // Output directory for the static export
  basePath: basePath,
  assetPrefix: assetPrefix,
  images: {
    unoptimized: true, // Required for static exports
  },
  trailingSlash: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { 
        fs: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
        ws: false,
        'pino-pretty': false,
        '@react-native-async-storage/async-storage': false
      };
    }
    
    // Ignore problematic modules that cause issues in browser
    config.resolve.alias = {
      ...config.resolve.alias,
      '@coinbase/cdp-sdk/client/solana': false,
      '@coinbase/cdp-sdk/dist/client/solana': false,
      '@solana/rpc-subscriptions-channel-websocket': false,
      'pino-pretty': false,
      '@react-native-async-storage/async-storage': false,
    };
    
    return config;
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;

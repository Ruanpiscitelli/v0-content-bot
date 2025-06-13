/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['ik.imagekit.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Fix webpack cache corruption issues
    if (dev) {
      // Disable problematic cache strategies in development
      config.cache = {
        type: 'memory'
      };
    }
    
    // Add better error handling for file system operations
    config.infrastructureLogging = {
      level: 'error',
      debug: false
    };
    
    // Return the modified config
    return config
  },
  experimental: {
    // Enable better SWC transforms for stability
    forceSwcTransforms: true,
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}

export default nextConfig

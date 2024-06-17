/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ['@seventy-seven/ui'],
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      return config
    }

    config.resolve = config.resolve ?? {};
    config.resolve.fallback = config.resolve.fallback ?? {};

    // these are not available in the browser:
    config.resolve.fallback.async_hooks = false;
    config.resolve.fallback.fs = false;
    config.resolve.fallback.child_process = false;
    config.resolve.fallback['stream/promises'] = false;
    config.resolve.fallback.net = false;

    return config;
  },
}

export default config

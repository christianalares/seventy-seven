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
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default config

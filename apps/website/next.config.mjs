/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ['@seventy-seven/ui'],
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  }
}

export default config

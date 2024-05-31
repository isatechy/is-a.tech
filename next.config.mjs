import("./src/env.mjs")

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["tsx", "ts", "js"],
  images: {
    remotePatterns: [],
  },
}

export default nextConfig

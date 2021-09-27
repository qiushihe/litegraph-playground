const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  assetPrefix: process.env.BASE_PATH || "",
  basePath: process.env.BASE_PATH || "",
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      "/": { page: "/" },
      "/playground": { page: "/playground" }
    };
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          // Copy @mediapipe/pose data into the public directory so ML assets can be loaded
          // locally instead of from CDN URLs.
          // See: https://github.com/google/mediapipe/issues/2407
          {
            from: path.join(__dirname, "node_modules/@mediapipe/pose"),
            to: path.join(__dirname, "public/mediapipe/pose/")
          }
        ]
      })
    );

    return config;
  },

  // Force "page" components inside `pages` directory to have a distinctive extension.
  // This way, we can co-locate page-specific components and files (i.e. `*.style.ts`) in the same
  // directory as the page component itself.
  // This is a good idea.
  pageExtensions: ["page.ts", "page.tsx", "api.ts"]
};

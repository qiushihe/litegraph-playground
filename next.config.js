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

  // Force "page" components inside `pages` directory to have a distinctive extension.
  // This way, we can co-locate page-specific components and files (i.e. `*.style.ts`) in the same
  // directory as the page component itself.
  // This is a good idea.
  pageExtensions: ["page.ts", "page.tsx", "api.ts"]
};

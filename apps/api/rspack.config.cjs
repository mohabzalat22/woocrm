const path = require("node:path");
const nodeExternals = require("webpack-node-externals");

/**
 * Rspack cannot read a tsconfig that uses `extends`.
 * Keep the shared config for TypeScript and point Rspack at the local alias map.
 */
module.exports = (defaultConfig) => ({
  ...defaultConfig,
  // @repo/database points to TypeScript source files. Keep it inside the
  // bundle so Node does not try to resolve its extensionless ESM imports.
  externals: [
    nodeExternals({
      importType: "module",
      allowlist: ["@repo/database"],
    }),
    ...defaultConfig.externals.slice(1),
  ],
  resolve: {
    ...defaultConfig.resolve,
    tsConfig: {
      configFile: path.resolve(__dirname, "tsconfig.rspack.json"),
    },
  },
});

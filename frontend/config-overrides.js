const { injectBabelPlugin } = require("react-app-rewired");
const rewireLess = require("react-app-rewire-less");

module.exports = function override(config, env) {
  // do stuff with the webpack config...
  config = injectBabelPlugin(
    ["import", { libraryName: "antd", libraryDirectory: "es", style: true }],
    config
  );
  config = rewireLess.withLoaderOptions({
    modifyVars: {
      "@font-family": `"Bai Jamjuree", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";`,
      "@font-size-base": "16px"
    },
    javascriptEnabled: true
  })(config, env);
  return config;
};

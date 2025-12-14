// Custom wrapper to remove worklets plugin from nativewind
// NativeWind's react-native-css-interop adds worklets plugin for Reanimated 4.x compatibility
// But we're using Reanimated 3.19.x which bundles worklets internally, so we filter it out
const nativewindBabel = require("nativewind/babel");

function nativewindBabelWithoutWorklets(api) {
  const config = nativewindBabel(api);
  // Filter out react-native-worklets/plugin since Reanimated 3.x handles worklets internally
  if (config.plugins) {
    config.plugins = config.plugins.filter((plugin) => {
      if (!plugin) return true; // Keep null/undefined plugins
      if (typeof plugin === "string") {
        return plugin !== "react-native-worklets/plugin";
      }
      if (Array.isArray(plugin)) {
        return plugin[0] !== "react-native-worklets/plugin";
      }
      return true;
    });
  }
  return config;
}

module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        ["babel-preset-expo", { 
          jsxImportSource: "nativewind",
          worklets: false, // Disable worklets plugin - Reanimated 3.x handles it internally
          reanimated: false // Disable auto-adding reanimated plugin - we add it manually below
        }],
        nativewindBabelWithoutWorklets,
      ],
      plugins: [
        "react-native-reanimated/plugin", // Must be listed last
      ],
    };
  };
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("wasm");

const defaultEnhanceMiddleware = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware) => {
  const enhanced = defaultEnhanceMiddleware
    ? defaultEnhanceMiddleware(middleware)
    : middleware;
  return (req, res, next) => {
    res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    enhanced(req, res, next);
  };
};

module.exports = withNativeWind(config, { input: "./global.css" });

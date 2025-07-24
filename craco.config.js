module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // CSS 최적화 비활성화
      const miniCssExtractPlugin = webpackConfig.plugins.find(
        plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
      );
      
      if (miniCssExtractPlugin && miniCssExtractPlugin.options) {
        miniCssExtractPlugin.options.ignoreOrder = true;
      }

      // CSS 미니파이어 비활성화
      if (webpackConfig.optimization && webpackConfig.optimization.minimizer) {
        webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.filter(
          minimizer => minimizer.constructor.name !== 'CssMinimizerPlugin'
        );
      }

      // Node.js 모듈에 대한 fallback 추가 (AWS SDK 호환성)
      if (!webpackConfig.resolve) {
        webpackConfig.resolve = {};
      }
      if (!webpackConfig.resolve.fallback) {
        webpackConfig.resolve.fallback = {};
      }
      
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "child_process": false,
        "util": false,
        "stream": false,
        "fs": false,
        "path": false,
        "os": false,
        "crypto": false,
        "buffer": false,
        "url": false,
        "querystring": false,
        "http": false,
        "https": false,
        "zlib": false,
        "assert": false,
        "constants": false,
        "events": false,
        "punycode": false,
        "string_decoder": false,
        "tty": false,
        "vm": false,
        "tls": false,
        "net": false,
        "dgram": false,
        "dns": false,
        "readline": false,
        "repl": false,
        "timers": false,
        "tty": false,
        "v8": false,
        "worker_threads": false
      };
      
      return webpackConfig;
    },
  },
}; 
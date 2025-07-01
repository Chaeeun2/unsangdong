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
      
      return webpackConfig;
    },
  },
}; 
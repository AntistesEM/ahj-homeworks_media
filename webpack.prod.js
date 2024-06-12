const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        // { from: './src/fonts', to: './fonts' },
        // { from: './src/favicon', to: './favicon' },
        { from: './src/img', to: './img' },
        // { from: './src/uploads', to: './uploads' },
      ],
    }),
  ],
});

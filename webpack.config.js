const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, { mode }) => {
  const isDevMode = mode === 'development';

  return {
    mode: mode || 'development',
    entry: './src/js/index.js',
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '',
      clean: true,
    },
    devtool: isDevMode ? 'inline-source-map' : 'source-map',
    devServer: {
      open: true,
      port: 4000,
      hot: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        favicon: './public/icons/favicon.svg',
      }),
      new MiniCssExtractPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
  };
};

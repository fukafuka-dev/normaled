const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  entry: {
    app: './dev/js/index.js',
  },
  plugins: [
    new CleanWebpackPlugin(['nginx/app']),
    new HtmlWebpackPlugin({
      inject: "head",
      template: "./dev/index.html"
    }),
    new MiniCssExtractPlugin({
      filename: './styles/[name].css',
    })
  ],
  output: {
    filename: './js/[name].bundle.js',
    path: path.resolve(__dirname, 'nginx/app')
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    },
    {
      test: /\.css/,
      use: [
        MiniCssExtractPlugin.loader, 
        {
          loader: 'css-loader',
          options: {
            url: false,
            minimize: true,
            sourceMap: process.env.NODE_ENV === 'development',
          },
        },
      ],
    },
    {
      test: /\.(gif|png|jpg)$/,
      loader: 'file-loader',
      options: {
        name: './images/[name].[ext]'
      }
    }]
  }
};
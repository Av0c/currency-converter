'use strict';

const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const fs = require('fs')
const directory = fs.realpathSync(process.cwd())
const resolve = (relativePath) => path.resolve(directory, relativePath)

const commonConfig = {
  resolve: {
    alias: {
      '@hooks': resolve('src/hooks'),
      '@client': resolve('src/client.ts'),
      '@utils': resolve('src/utils'),
      '@components': resolve('src/components'),
    },
    modules: [resolve('.'), 'node_modules'], // Allow absolute import
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
}

const developmentConfig = {
  devtool: 'eval-source-map',
  mode: 'development',
  entry: {
    'js': [
      resolve('src/index.tsx')
    ]
  },
  output: {
    pathinfo: true,
    path: resolve('build'),
    filename: '[name]/bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.[j|t]sx?$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: {
          plugins: [
            require("react-refresh/babel")
          ]
        }
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|png)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      inject: true,
      template: resolve('src/index.html'),
      chunks: ['js']
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: resolve('public'),
        to: resolve('build'),
        noErrorOnMissing: true
      }]
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin()
  ],
  devServer: {
    port: 8081,
    host: '0.0.0.0',
    hot: true,
    historyApiFallback: true
  }
};

const productionConfig = module.exports = {
  mode: 'production',
  entry: ['./src/index.tsx'],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  output: {
    filename: '[name].bundle.[contenthash].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    clean: true 
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.[j|t]sx?$/,
        loader: 'babel-loader',
        options: {
          compact: true
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|png)$/,
        type: 'asset/resource'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: './src/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.[hash].css'
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'public'),
        to: path.resolve(__dirname, 'build'),
        noErrorOnMissing: true
      }]
    })
  ]
};

module.exports = (env, args) => {
  switch(args.mode) {
    case 'development':
      return merge(commonConfig, developmentConfig);
    case 'production':
      return merge(commonConfig, productionConfig);
    default:
      throw new Error('No matching configuration was found!');
  }
}
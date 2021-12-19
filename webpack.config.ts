import * as fs from 'fs';
import * as path from 'path';
import { Program } from 'typescript'
import { cellTransformer } from './utillity/cell-transformer'
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const WebpackBar = require('webpackbar');

const {
  NODE_ENV = 'production',
} = process.env;

const services = fs.readdirSync('./src/$gateway')
  .reduce((acc, v) => ({ ...acc, [v]: `./src/$gateway/${v}` }), {});

module.exports = {
  entry: services,
  mode: NODE_ENV,
  target: 'node',
  devtool: 'source-map',
  watch: true,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]/index.js',
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              getCustomTransformers: (program: Program) => {
                return {
                  after: [cellTransformer],
                };
              },
            },
          }
        ],
      }
    ]
  },
  externals: [nodeExternals()],
  plugins: [
    new WebpackBar(),
    new NodemonPlugin(),
    // new NodemonPlugin({
    //   ext: 'js',
    //   script: './dist/yo/index.js',
    // }),
    // new NodemonPlugin({
    //   ext: 'js',
    //   script: './dist/lo/index.js',
    // }),
  ],
  stats: 'errors-only'
}
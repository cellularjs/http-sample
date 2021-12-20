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
  GATEWAY_SCRIPT = './http/index.ts'
} = process.env;

const gatewayScriptArr = GATEWAY_SCRIPT.split('/');

if (gatewayScriptArr.length < 2) {
  console.error('> Incorrect gateway script. Valid GATEWAY_SCRIPT must be look like this: "./index.ts" or "./http/index.ts"');
  process.exit(1);
}

const appName = gatewayScriptArr.length > 2
  // use parent folder name
  ? gatewayScriptArr[gatewayScriptArr.length - 2]
  // use file name
  : gatewayScriptArr[gatewayScriptArr.length - 1].split('.')[0];

const dist = path.resolve(__dirname, 'dist');
const bundleFile = 'index.js'

module.exports = {
  entry: {
    [appName]: path.resolve('./src/$gateway', GATEWAY_SCRIPT)
  },
  mode: NODE_ENV,
  target: 'node',
  devtool: 'source-map',
  watch: true,
  output: {
    path: dist,
    filename: `[name]/${bundleFile}`,
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
    new NodemonPlugin({
      ext: 'js',
      script: path.resolve(dist, appName, bundleFile),
    }),
  ],
  stats: 'errors-only'
}
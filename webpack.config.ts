import * as fs from 'fs';
import * as path from 'path';
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const WebpackBar = require('webpackbar');
import * as ts from 'typescript'
import { Program, TransformationContext } from 'typescript'

const factory = ts.factory;

const {
  NODE_ENV = 'production',
} = process.env;

const services = fs.readdirSync('./src/$gateway')
  .reduce((acc, v) => ({ ...acc, [v]: `./src/$gateway/${v}` }), {});


function getAllFilePath(dir, prefix) {
  const listFiles = [];

  const recursiveFile = (dir, prefix) => {
    const listNewFiles = fs.readdirSync(dir);

    for (let i = 0; i < listNewFiles.length; i++) {
      const newPath = path.join(dir, listNewFiles[i]);

      if (fs.lstatSync(newPath).isDirectory()) {
        recursiveFile(newPath, prefix + '/' + listNewFiles[i]);
        continue;
      }

      listFiles.push(prefix + '/' + listNewFiles[i])
    }
  }

  recursiveFile(dir, prefix);

  return listFiles;
}

const cellTransformer: ts.TransformerFactory<ts.SourceFile> = (context: TransformationContext) => {
  let pathOfCurrentFile: string;

  const isDefinedListenProperty = (node: ts.CallExpression) => {
    const cellMetaExpression = <ts.ObjectLiteralExpression>node.arguments[0];

    return !!cellMetaExpression.properties.find((property: ts.PropertyAssignment) => {
      return (<ts.Identifier>property.name).escapedText === 'listen'
    });
  };

  const updateCellDecorator = (node: ts.CallExpression) => {
    if (!isDefinedListenProperty(node)) {
      return node;
    }

    const cellMetaExpression = <ts.ObjectLiteralExpression>node.arguments[0];
    const cellListenAssignment = <ts.PropertyAssignment>cellMetaExpression.properties.find(
      property => (<ts.Identifier>property.name).escapedText === 'listen'
    );

    const listenInitializer = cellListenAssignment.initializer;
    if (!ts.isStringLiteral(listenInitializer)) {
      return node;
    }

    const listenValue = listenInitializer.text;
    const serviceDir = path.join(pathOfCurrentFile, listenValue);
    const listFiles = getAllFilePath(serviceDir, listenValue);
    const newListenExpressions = listFiles.map(filePath => factory.createCallExpression(
      factory.createIdentifier('require'),
      undefined,
      [factory.createStringLiteral(filePath)]
    ));

    // remove previous listen property and assign new value for it.
    const newCellMetaExpression = factory.updateObjectLiteralExpression(
      factory.createObjectLiteralExpression(),
      [
        ...cellMetaExpression.properties.filter(
          property => (<ts.Identifier>property.name).escapedText !== 'listen'
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier('listen'),
          factory.createArrayLiteralExpression(newListenExpressions),
        ),
      ],
    );

    return factory.updateCallExpression(node, node.expression, undefined, [newCellMetaExpression]);
  };

  const visit = (node: ts.Node) => {
    const isCellDecoratorExpression =
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.escapedText === 'Cell';

    if (isCellDecoratorExpression) {
      return updateCellDecorator(node);
    }

    return ts.visitEachChild(node, child => visit(child), context);
  };


  return node => {
    // console.log('node', node)
    if (ts.isSourceFile(node)) {
      pathOfCurrentFile = path.dirname(node.fileName);
    }
    return ts.visitNode(node, visit)
  };
}

module.exports = {
  entry: services,
  mode: NODE_ENV,
  target: 'node',
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
  watch: true,
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
  ]
}
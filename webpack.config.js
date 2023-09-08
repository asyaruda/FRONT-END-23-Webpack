const path = require('node:path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production',
    plugins: [new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'index.html') })],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
    },
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
        {
          test: /\.css$/i,
          exclude: /node_modules/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1,
                modules: {
                  localIdentName: '[name]__[local]__[contenthash:base64:5]',
                  auto: resourcePath => resourcePath.endsWith('.m.css'),
                },
              },
            },
          ],
        },
      ],
    },
  };
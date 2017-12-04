const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const src = path.resolve('src')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve('dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react'],
              plugins: ['babel-plugin-transform-object-rest-spread']
            }
          }
        ],
        include: [src, path.resolve(path.join('..', 'src'))]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: true } }
        ],
        include: src
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // Required
      inject: false,
      template: require('html-webpack-template'),
      appMountId: 'app'
    })
  ]
}

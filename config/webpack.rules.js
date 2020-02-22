const path = require("path");

module.exports = [
  {
    test: /\.jsx?$/,
    exclude: [
      path.resolve(__dirname, '../node_modules')
    ],
    use: 'babel-loader'
  },
  {
    test: /\.(eot|ttf|woff|woff2)$/,
    use: 'file-loader?name=fonts/[name].[ext]'
  },
  {
    test: /\.ico$/,
    use: 'file-loader?name=[name].[ext]'
  },
  {
    test: /\.(gif|jpg|png)$/,
    use: 'file-loader?name=img/[name].[ext]'
  },
  {
    test: /\.svg$/,
    use: [
      'svg-inline-loader'
    ]
  },
  {
    test: /[\/\\](node_modules|global|src)[\/\\].*\.scss$/,
    use: [
      'style-loader',
      "css-loader",
      "sass-loader"
    ]
  },
  {
    test: /[\/\\](node_modules|global|src)[\/\\].*\.css$/,
    use: [
      'style-loader',
      'css-loader'
    ]
  }
];

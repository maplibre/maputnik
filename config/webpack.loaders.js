module.exports = [
  {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components|public)/,
    loaders: ['react-hot-loader/webpack']
  },
  {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components|public)/,
    loader: 'babel',
    query: {
      presets: ['es2015', 'react'],
      plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties'],
    }
  },
  {
    test: /\.(eot|ttf|woff|woff2)$/,
    loader: 'file?name=fonts/[name].[ext]'
  },
  {
    test: /\.ico$/,
    loader: 'file?name=[name].[ext]'
  },
  {
    test: /\.(svg|gif|jpg|png)$/,
    loader: 'file?name=img/[name].[ext]'
  },
  {
    test: /\.json$/,
    loader: 'json-loader'
  },
  {
    test: /[\/\\](node_modules|global|src)[\/\\].*\.scss$/,
    loaders: ["style-loader", "css-loader", "sass-loader"]
  },
  {
    test: /[\/\\](node_modules|global|src)[\/\\].*\.css$/,
    loaders: [
      'style?sourceMap',
      'css'
    ]
  }
];

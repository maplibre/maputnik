module.exports = [
  {
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components|public)/,
    loaders: ['react-hot-loader/webpack']
  },
  // HACK: This is a massive hack and reaches into the mapbox-gl private API.
  // We have to include this for access to `normalizeSourceURL`. We should
  // remove this ASAP, see <https://github.com/mapbox/mapbox-gl-js/issues/2416>
  {
    test: /.*node_modules[\/\\]mapbox-gl[\/\\]src[\/\\]util[\/\\].*\.js/,
    loader: 'babel-loader',
    query: {
      presets: ['env', 'react', 'flow'],
      plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties'],
    }
  },
  {
    test: /\.jsx?$/,
    exclude: /(.*node_modules(?![\/\\]@mapbox[\/\\]mapbox-gl-style-spec)|bower_components|public)/,
    loader: 'babel-loader',
    query: {
      presets: ['env', 'react'],
      plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties'],
    }
  },
  {
    test: /\.(eot|ttf|woff|woff2)$/,
    loader: 'file-loader?name=fonts/[name].[ext]'
  },
  {
    test: /\.ico$/,
    loader: 'file-loader?name=[name].[ext]'
  },
  {
    test: /\.(svg|gif|jpg|png)$/,
    loader: 'file-loader?name=img/[name].[ext]'
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
      'style-loader?sourceMap',
      'css-loader'
    ]
  }
];

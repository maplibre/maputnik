const path = require("path");

module.exports = [
  {
    test: /\.jsx?$/,
    exclude: [
      path.resolve(__dirname, '../node_modules')
    ],
    use: 'babel-loader'
  },
  // HACK: This is a massive hack and reaches into the mapbox-gl private API.
  // We have to include this for access to `normalizeSourceURL`. We should
  // remove this ASAP, see <https://github.com/mapbox/mapbox-gl-js/issues/2416>
  {
    test: /\.jsx?$/,
    include: [
      path.resolve(__dirname, '../node_modules/mapbox-gl/src/util/')
    ],
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-flow'],
        plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties'],
      }
    }
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
    test: /\.(svg|gif|jpg|png)$/,
    use: 'file-loader?name=img/[name].[ext]'
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

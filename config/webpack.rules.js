const path = require("path");

module.exports = [
  {
    test: /\.jsx?$/,
    exclude: [
      path.resolve(__dirname, '../node_modules')
    ],
    use: {
      loader: 'babel-loader',
      options: {
        "presets": [
          "@babel/preset-env",
          "@babel/preset-react"
        ],
        "plugins": [
          "react-hot-loader/babel",
          "@babel/plugin-proposal-class-properties"
        ],
        "env": {
          "test": {
            "plugins": [
              ["istanbul", {
                "exclude": ["node_modules/**", "test/**"]
              }]
            ]
          }
        }
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

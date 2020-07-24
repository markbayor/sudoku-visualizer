const { resolve } = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  return {
    entry: {
      main: "./src/App.tsx",
    },
    mode: "development",
    devtool: "source-map",
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx", ".scss"],
      modules: ["src", "node_modules"],
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: [resolve(__dirname, "src")],
          use: ["babel-loader"],
        },
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    output: {
      path: resolve(__dirname, "dist"),
      filename: "bundle.js",
    },
    // externals: {
    //   react: "React",
    //   "react-dom": "ReactDOM",
    // },
    devServer: {
      compress: true,
      historyApiFallback: true,
      host: '0.0.0.0',
      port: 9000,
      publicPath: "/dist",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolve('./index.html'),
      }),
    ]
  };
};

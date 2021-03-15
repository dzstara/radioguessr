const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: false,
  watch: true,
  entry: {
    background: "./src/background/main.js",
    "browser-action": "./src/browser-action/app.js",
    "content-script": "./src/content-script/main.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "static", to: "." }],
    }),
  ],
};

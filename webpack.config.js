const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    //  configure file entry and output
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "build"),
    },
    //copy static(index html) to build
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "public", "index.html"),
        }),
    ],
    //configure server
    devServer: {
        static: {
            directory: path.join(__dirname, "build"),
        },
        port: 3000,
    },
    module: {
        // exclude node_modules
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ["babel-loader"],
          },
        ],
      },
      // pass all js files through Babel
      resolve: {
        extensions: ["*", ".js", ".jsx"],
      }
};
const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

function getHtmlFilePaths(directory) {
  const folderPath = path.join(__dirname, directory);

  function traverseFolder(folderPath, result = []) {
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const fileStats = fs.statSync(filePath);

      if (fileStats.isDirectory()) {
        traverseFolder(filePath, result);
      } else if (path.extname(file) === ".html") {
        const relativePath = path.relative(__dirname, filePath);
        result.push(relativePath);
      }
    });

    return result;
  }

  return traverseFolder(folderPath);
}

const htmlFilePaths = getHtmlFilePaths("pages");

const htmlPagesPluginPaths = htmlFilePaths.map(
  (path) =>
    new HtmlWebpackPlugin({
      template: path,
      filename: path,
    })
);

/** @type { import('webpack').Configuration } */
module.exports = {
  entry: {
    index: [
      path.join(__dirname, "css/index.css"),
      path.join(__dirname, "js/index.js"),
    ],
  },
  mode: isProduction ? "production" : "development",
  // The location of the build folder described above
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  // output: {
  //   path: path.resolve(__dirname, "dist"),
  //   publicPath: "/",
  // },
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  devtool: isProduction ? undefined : "eval-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: !isProduction,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "images", to: "images" }],
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[name].[contenthash:8].css",
    }),
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    ...htmlPagesPluginPaths,
  ],
};

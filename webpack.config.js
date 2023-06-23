const path = require("path");
const HtmlBundlerPlugin = require("html-bundler-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    index: "./src/index.js",
    sdk_quickstart: "./src/sdk_quickstart/get_started.js",
    authentication_workflow: "./src/authentication_workflow/authentication_workflow.js",
    read_write_metadata: "./src/read_write_metadata/read_write_metadata.js"
  },
  plugins: [
    new HtmlBundlerPlugin({
      js: {
        filename: 'assets/js/[name].[contenthash:8].js',
      },
      css: {
        filename: 'assets/css/[name].[contenthash:8].js',
      }
    })
  ],
  module: {
    rules: [
      // Note: enable processing of HTML files from entry
      {
        test: /\.html$/,
        loader: HtmlBundlerPlugin.loader, // HTML loader
      },
      // styles
      {
        test: /\.(css|sass|scss)$/,
        use: ['css-loader', 'sass-loader'],
      },
      // images
      {
        test: /\.(png|jpe?g|svg|ico)/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name].[hash:8][ext]',
        },
    },
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  devServer: {
    static: path.resolve(__dirname, "./src"),
    compress: true,
    port: 9000,
  },
};

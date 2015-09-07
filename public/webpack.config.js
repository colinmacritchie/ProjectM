var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    devtool: 'eval',
    entry: ["./app.js"],
    output: {
        path: "workbox/assets/theme",
        filename: 'theme.bundle.js'
    },
    node: {
      fs: "empty"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'jsx-loader?harmony'
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("css-loader?sourceMap")
        }, {
            test: /\.woff$/,
            loader: "url-loader?limit=10000&minetype=application/font-woff"
        }, {
            test: /\.woff2$/,
            loader: "url-loader?limit=10000&minetype=application/font-woff"
        }, {
            test: /\.ttf$/,
            loader: "file-loader"
        }, {
            test: /\.eot$/,
            loader: "file-loader"
        }, {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: [
              'file?hash=sha512&digest=hex&name=[hash].[ext]',
              'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
              ]
        }]
    },
    plugins: [
      new ExtractTextPlugin("theme.bundle.css", { allChunks: true })
    ]
};

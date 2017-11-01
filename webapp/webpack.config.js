const webpack = require("webpack")
module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js",
    },
    devtool: 'cheap-module-eval-source-map',
    module: {
        loaders: [
            {test: /\.css$/, loader: "style!css"}
        ]
    },
    devServer: {
        contentBase: __dirname,
        compress: true,
        port: 7009,
        hot: true
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
}
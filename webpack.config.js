const webpack = require("webpack");
const path = require("path");
const process = require("process");

module.exports = {
    entry: {
        "app.min": "./src/js/app.js"
    },
    output: {
        path: path.resolve(__dirname, "public/dist")
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules\/(?!minicomponent)/,
                loader: "babel-loader",
                query: {
                    cacheDirectory: true,
                    presets: [
                        ["@babel/preset-env"]
                    ],
                },
            }
        ]}
};
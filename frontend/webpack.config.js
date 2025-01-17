const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.ts',
    mode: 'development',
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.d.ts'],
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/static/images", to: "images"},
                {from: "./src/components/dashboard/menu.js", to: "js"},
                {from: "./src/components/dashboard/diagrams.js", to: "js"},
                {from: "./src/utils/delete_action.ts", to: "js"},
                {from: "./node_modules/chart.js/dist/chart.umd.js", to: "js"},
                {from: "./src/components/bootstrap.bundle.min.js", to: "js"},
                {from: "./src/css", to: "css"},
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules|\.d\.ts$/
            },
        ],
    },
};
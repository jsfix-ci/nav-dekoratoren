const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const browserConfig = {
    mode: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
    target: 'web',
    entry: {
        client: './src/indexhydrat.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'buildfolder'),
        filename: '[name].js',
        publicPath: '/',
    },
    devtool: 'cheap-module-source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
    },
    stats: 'errors-only',
    module: {
        rules: [
            {
                test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: 'file-loader',
                options: {
                    name: './media/[name].[ext]',
                },
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: {} },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [require('autoprefixer')()],
                        },
                    },
                    { loader: 'less-loader', options: {} },
                ],
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: { reportFiles: ['src/**/*.{ts,tsx}', '!src/skip.ts'] },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: './css/[name].css',
        }),
        new HtmlWebpackPlugin(),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.BROWSER': JSON.stringify(true),
        }),
    ],
};

module.exports = browserConfig;

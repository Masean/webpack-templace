const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const  CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const CleanWebpackPlugin = require('clean-webpack-plugin');

const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
    assets: 'assets/'
  }

  const PAGES_DIR = `${PATHS.src}/pug/pages/`;
  const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));
  

module.exports = {

    externals: {
        paths: PATHS
    },
    entry: {
        app: PATHS.src
    },
    output: {
        filename: `${PATHS.assets}js/[name].[hash].js`,
        path: PATHS.dist,
        publicPath: '/'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [{
            test: /\.pug$/,
            loader: 'pug-loader'
          }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: '/node_modules/'
        },{
            test: /\.(png\jpg\gif\svg)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]'
            }
        },{
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          },{
            test: /\.scss$/,
           use: [
               'style-loader',
               MiniCssExtractPlugin.loader,
               {
                   loader: 'css-loader',
                   options: {sourceMap: true}
               },{
                loader: 'postcss-loader',
                options: {sourceMap: true,
                          config: {path: './postcss.config.js'}}
            },
               {
                loader: 'sass-loader',
                options: {sourceMap: true}
            }
            
           ]
        },
        {
            test: /\.css$/,
           use: [
               'style-loader',
               MiniCssExtractPlugin.loader,
               {
                 loader: 'css-loader',
                 options: {sourceMap: true}
               },{
                 loader: 'postcss-loader',
                 options: {sourceMap: true,
                           config: {path: `./postcss.config.js`}}
               }
           ]
        }]
    },
    resolve: {
        alias: {
            '~': 'src'
        }
    },

    plugins: [
        //new CleanWebpackPlugin(PATHS.dist, {}),
        new MiniCssExtractPlugin({
            filename: `${PATHS.assets}css/[name].[contenthash].css`
        }),
        new HtmlWebpackPlugin({
            template: `${PATHS.src}/index.html`,
            filename: './index.html',
            inject: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` },
                { from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
                { from: `${PATHS.src}/static`, to: "" }
            ]
          }),
          ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page.replace(/\.pug/,'.html')}`
          }))
    ]
}
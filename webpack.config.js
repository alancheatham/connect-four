var webpack = require('webpack');
var path = require('path');

var config = {
    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    entry: [
        'webpack-dev-server/client?http://localhost:3001',
        'webpack/hot/only-dev-server',
        './src/app.js'
    ],

    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'cf.js',
        publicPath: '/dist/assets/'
    },

    module: {
        preLoaders: [],

        loaders: [
            {
                test:   /\.less$/,
                loader: 'style!css!less'
            },
            {
                test: /\.(js|jsx)$/,  
                loaders: ['babel', 'react-hot-loader/webpack'],
                exclude: /node_modules/
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = config;
/* globals module __dirname */
module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/dist/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loaders: ['style-loader', 'css-loader'],
            exclude: /node_modules/
        }, {
            test: /\.pug$/,
            loader: 'pug-html-loader',
            exclude: /node_modules/
        }, {
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    }
};

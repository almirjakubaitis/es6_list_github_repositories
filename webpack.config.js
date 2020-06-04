module.exports = {
    entry: ['@babel/polyfill' , './src/main.js'],
    devtool: 'inline-source-map',
    output: {
        path:__dirname + '/public',
        filename: 'bundle.js',
    },
    devServer: {
        contentBase: __dirname + '/public',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ],
    },
}
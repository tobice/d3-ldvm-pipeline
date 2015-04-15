module.exports = {
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.css$/, loader: 'style!css'}
        ]
    },
    externals: {
        'd3': 'd3'
    }
};
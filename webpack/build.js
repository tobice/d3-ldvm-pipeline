var extend = require('util')._extend;
var optimize = require('webpack').optimize;
var common = require('./common.js');

module.exports = extend(common, {
    entry: __dirname + '/../src/d3LdvmPipeline.js',
    output: {
        path: __dirname + '/../dist/',
        filename: 'd3LdvmPipeline.min.js',
        libraryTarget: 'umd',
        library: 'd3LdvmPipeline'
    },
    plugins: [
        new optimize.UglifyJsPlugin()
    ],
    externals: {
        'd3': 'd3'
    }
});
var extend = require('util')._extend;
var common = require('./common.js');

module.exports = extend(common, {
    entry: __dirname + "/../index.js",
    output: {
        path: __dirname + "/build/",
        publicPath: "/build/",
        filename: "bundle.js"
    },
    devtool: 'source-map',
    cache: true
});
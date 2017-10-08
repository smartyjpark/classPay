const path = require('path');

module.exports = {
    entry: './public/src/index.js',
    output: {
        path: path.resolve(__dirname, './public/dist'),
        filename: 'bundle.js'
    },
    devServer: {
        host: "0.0.0.0",
        disableHostCheck: true
    }
};

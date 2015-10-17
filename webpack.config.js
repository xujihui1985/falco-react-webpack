 var webpack = require('webpack');
 var path = require('path');

 var config = {
   context: __dirname,
   entry: './index.jsx',
   output: {
     publicPath: '/',
     path: path.resolve(__dirname, process.env.NODE_ENV === 'production' ? './dist/' : './build'),
     filename: 'bundle.js'
   },
   module: {
     loaders: [{
       test: /\.jsx|js$/,
       loader: 'babel',
       exclude: [path.join(__dirname, 'node_modules')]
     }]
   }
 };

 module.exports = config;

var webpack = require("webpack");
var path = require("path");
module.exports = {
	context: __dirname,
	devtool: 'sourcemap',
	entry: [
		'babel-polyfill',
		'./src/main.js'
	],
	output: {
		path: path.join(__dirname, "dist"),
		filename: "index.js", // no hash in main.js because index.html is a static page
	},
	module: {
		loaders: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.scss$/,
				loader: 'style-loader!css-loader!sass-loader'
			},
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				query: {
					presets: ['es2015', 'stage-3'],
				}
			},
		],
	},
	babel: {
		presets: ['es2015', 'stage-3']
  },
};
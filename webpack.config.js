const webpack = require( 'webpack' );

const config = {
	entry: {
		'edit-attachment': './admin/assets/js/edit-attachment.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: __dirname + '/admin/assets/js'
	},
	externals: {
		jquery: 'jQuery',
		wp: 'wp'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			}
		]
	},
	plugins: []
};

switch ( process.env.NODE_ENV ) {
	case 'production':
		config.plugins.push( new webpack.optimize.UglifyJsPlugin() );
		break;

	default:
		config.devtool = 'source-map';
}

module.exports = config;

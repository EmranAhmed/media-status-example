/**
 * External dependencies
 */
const { join } = require( 'path' );
const [
	defaultJSConfig,
	defaultModuleConfig,
] = require( '@wordpress/scripts/config/webpack.config' );
const {
	fromProjectRoot,
	requestToExternal,
	requestToHandle,
	requestToExternalModule,
	getFile,
	getWebPackAlias,
} = require( './bin/webpack-helpers' );
const { sep } = require( 'path' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );

const scriptConfig = {
	...defaultJSConfig,
	entry: {
		// ...defaultJSConfig.entry(),
		'scripts/index': getFile('index.js'),
		'scripts/storepress-utils': {
			//import: '@storepress/utils/build/index.js',
			import: '@storepress/utils/build-module/index.js',
			// filename: 'pages/[name].js',
			library: {
				name: ['StorePress','Utils'],
				type: 'window',
				// type: 'umd',
				// export:'default'
			},
		}
	},

	resolve: {
		...defaultJSConfig.resolve,
		alias: {
			...defaultJSConfig.resolve.alias,
			...getWebPackAlias(),
		},
	},

	plugins: [
		// ...defaultJSConfig.plugins,
		...defaultJSConfig.plugins.filter(
			( plugin ) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new DependencyExtractionWebpackPlugin( {
			requestToExternal,
			requestToHandle,
			requestToExternalModule,
		} ),

		// Removes the empty `.js` files generated by webpack but
		// sets it after WP has generated its `*.asset.php` file.
		new RemoveEmptyScriptsPlugin( {
			stage: RemoveEmptyScriptsPlugin.STAGE_AFTER_PROCESS_PLUGINS,
		} ),
	],
};

const moduleConfig = {
	...defaultModuleConfig,
	experiments: {
		outputModule: true
	},
	entry: {
		// ...defaultModuleConfig.entry(),
		'modules/index': getFile('index.js'),
		// 'user-control': fromProjectRoot('user-control.js'),
		'modules/storepress-utils': {
			import: '@storepress/utils/build-module/index.js',
			library: {
				// name: ['StorePress','Utils'],
				type: 'module',
			},
		}
	},

	resolve: {
		...defaultModuleConfig.resolve,
		alias: {
			...defaultModuleConfig.resolve.alias,
			...getWebPackAlias(),
		},
	},

	plugins: [
		// ...defaultModuleConfig.plugins,
		...defaultModuleConfig.plugins.filter(
			( plugin ) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new DependencyExtractionWebpackPlugin( {
			requestToExternal,
			requestToHandle,
			requestToExternalModule,
		} ),

		// Removes the empty `.js` files generated by webpack but
		// sets it after WP has generated its `*.asset.php` file.
		new RemoveEmptyScriptsPlugin( {
			stage: RemoveEmptyScriptsPlugin.STAGE_AFTER_PROCESS_PLUGINS,
		} ),
	],
};

module.exports = [ scriptConfig, moduleConfig ];






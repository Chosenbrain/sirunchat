const path = require('path');
const Webpack = require('webpack');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = function override(config, env) {
  // Production optimizations (minification, etc.)
  if (env === 'production') {
    // Adding Webpack Plugin for service worker integration
    config.plugins.push(
      new WorkboxPlugin.InjectManifest({
        swSrc: path.join(__dirname, 'src', 'service-worker.js'), // Adjust if using service-worker.ts
        swDest: 'service-worker.js',
      })
    );

    // Optional: Update caching strategy for better performance in production
    config.optimization.splitChunks = {
      chunks: 'all',
    };
    config.optimization.runtimeChunk = {
      name: 'runtime',
    };

    // Optional: Webpack Bundle Analyzer (for monitoring bundle size)
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    config.plugins.push(new BundleAnalyzerPlugin());

    // Modify Webpack's resolve settings if necessary (e.g., adding custom aliases)
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, 'src/components'),
    };
  }

  // Add environment variables for production
  config.plugins.push(
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL),
    })
  );

  return config;
};

const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  outputDir: 'docs',
  publicPath: process.env.NODE_ENV === 'production'
    ? '/darija-linguist/'
    : '/',
  
  // Disable source maps in production
  productionSourceMap: false,
  
  // Configure webpack-dev-server behavior
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },

  // Configure Webpack
  configureWebpack: {
    // Add any webpack configurations here
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  },

  // Configure how files are processed with chainWebpack
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Darija Linguist'
      return args
    })
  },

  // Configure CSS processing
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },

  // Vuetify configuration
  transpileDependencies: [
    'vuetify'
  ],

  // Plugin options
  pluginOptions: {
    // Add any plugin-specific options here
  }
})

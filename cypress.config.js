const { defineConfig } = require('cypress')

module.exports = defineConfig({
  includeShadowDom: true,
  video: false,
  defaultCommandTimeout: 10000,
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:5173',
  },
})

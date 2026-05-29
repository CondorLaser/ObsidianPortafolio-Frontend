const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      const mochawesomeReporter = require('cypress-mochawesome-reporter/plugin');
      mochawesomeReporter(on);
      return config;
    },
  }
});

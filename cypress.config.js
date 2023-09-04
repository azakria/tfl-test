const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    "chromeWebSecurity": false
  },

});

// // disable Cypress's default behavior of logging all XMLHttpRequests and fetches
// cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })

import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'r2go2u',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

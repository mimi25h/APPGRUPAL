// Application entry point.
// Loads environment configuration and starts the HTTP server.
const mainServer = require("./main.server");
const { loadConfig } = require("./config/env");

function runServer() {
  try {
    // Validates that the .env config file exists and all required environment variables are set.
    loadConfig();

    // Initializes and starts the Express HTTP server.
    mainServer();
  } catch (err) {
    console.error(err.message);
  }
}

// Bootstrap: run the server on startup.
runServer();

// Environment configuration loader.
// Reads the .env file from the config directory and validates all required variables.
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Absolute path to the expected .env configuration file.
const CONFIG_ENV_PATH = path.join(__dirname, ".env");

// Loads the .env file into process.env and validates required variables.
// Throws an error if the file is missing or any required variable is absent.
function loadConfig() {
  if (!fs.existsSync(CONFIG_ENV_PATH)) {
    throw new Error(
      `No se encontro archivo de configuracion: ${CONFIG_ENV_PATH}`,
    );
  }

  dotenv.config({ path: CONFIG_ENV_PATH });

  checkConfig();
}

// Checks that all required environment variables are defined and non-empty.
// Throws a descriptive error listing any missing variables.
function checkConfig() {
  const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
  const missingEnvVars = requiredEnvVars.filter(
    (key) => !process.env[key] || !process.env[key].trim(),
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Faltan variables de entorno: ${missingEnvVars.join(", ")}`,
    );
  }
}

module.exports = {
  loadConfig,
};

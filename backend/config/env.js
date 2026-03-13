const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const CONFIG_ENV_PATH = path.join(__dirname, ".env");

function loadConfig() {
  if (!fs.existsSync(CONFIG_ENV_PATH)) {
    throw new Error(
      `No se encontro archivo de configuracion: ${CONFIG_ENV_PATH}`,
    );
  }

  dotenv.config({ path: CONFIG_ENV_PATH });

  checkConfig();
}

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

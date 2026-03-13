const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mainServer = require("./main.server");

const CONFIG_ENV_PATH = path.join(__dirname, "config", ".env");

function runServer() {
  try {
    // Valida que exista el archivo de configuracion requerido.
    if (!fs.existsSync(CONFIG_ENV_PATH)) {
      throw new Error(
        `No se encontro archivo de configuracion: ${CONFIG_ENV_PATH}`,
      );
    }

    dotenv.config({ path: CONFIG_ENV_PATH });

    const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
    const missingEnvVars = requiredEnvVars.filter(
      (key) => !process.env[key] || !process.env[key].trim(),
    );

    if (missingEnvVars.length > 0) {
      throw new Error(
        `Faltan variables de entorno: ${missingEnvVars.join(", ")}`,
      );
    }

    mainServer();
  } catch (err) {
    console.log("El archivo de configuracion no existe o es invalido.");
    console.log("Este archivo es necesario para correr el servidor backend.");
    console.error(err.message);
  }
}

// Run server.
runServer();

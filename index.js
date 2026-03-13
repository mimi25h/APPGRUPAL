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
    mainServer();
  } catch (err) {
    console.log("El archivo de configuracion no existe o es invalido.");
    console.log("Este archivo es necesario para correr el servidor backend.");
    console.error(err.message);
  }
}


// Run server.
runServer();

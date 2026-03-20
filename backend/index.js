const mainServer = require("./main.server");
const { loadConfig } = require("./config/env");

function runServer() {
  try {
    // Valida que exista el archivo de configuracion requerido y que existan las variables de entorno.
    loadConfig();

    // Inicia el servidor.
    mainServer();
  } catch (err) {
    console.error(err.message);
  }
}

// Run server.
runServer();

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mainServer = require("./main.server");
const { checkConfigFile } = require("./config/env");

function runServer() {
  try {
    // Valida que exista el archivo de configuracion requerido y que existan las variables de entorno.
    loadConfig();

    mainServer();
  } catch (err) {
    console.log("El archivo de configuracion no existe o es invalido.");
    console.log("Este archivo es necesario para correr el servidor backend.");
    console.error(err.message);
  }
}

// Run server.
runServer();

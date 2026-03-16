const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { connectToMongo } = require("./config/db");

// Middlewares
const { verifyToken } = require("./main.middlewares");

// Cargar rutas de módulos.
const AuthRouter = require("./modules/auth/routes");
const peopleRoutes = require("./modules/people/routes");
const usersRoutes = require("./modules/users/routes");
const organizationsRoutes = require("./modules/organizations/routes");
const modalitiesRoutes = require("./modules/modalities/routes");

let mongoOk = false;

function mainServer() {
  const HTTP_PORT = process.env.HTTP_PORT || 3000;
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Conectar a MongoDB al iniciar el servidor.
  (async () => {
    try {
      const result = await connectToMongo(process.env.MONGO_URI);
      mongoOk = result.ok;
      if (result.ok) {
        console.log("Conectado a la base de datos MongoDB");
        console.log("Base de datos activa:", result.dbName);
      } else {
        console.log("Error al conectar a MongoDB:", result.error);
      }
    } catch (err) {
      mongoOk = false;
      console.log("Error al conectar a MongoDB:", err.message);
    }
  })();

  // Health endpoint (público).
  app.get("/", (req, res) => {
    const estadoConexion = mongoose.connection.readyState;
    const estados = {
      0: "Desconectado",
      1: "Conectado",
      2: "Conectando",
      3: "Desconectando",
    };

    if (mongoOk && estadoConexion === 1) {
      res.status(200).json({
        status: "OK",
        message: "Servidor funcionando correctamente",
        timestamp: new Date().toISOString(),
        baseDatos: {
          estado: estados[estadoConexion],
          conectado: true,
          nombreDB: mongoose.connection.db?.databaseName || "N/A",
        },
        servidor: {
          puerto: HTTP_PORT,
          nodejs: process.version,
        },
      });
    } else {
      res.status(500).json({
        status: "ERROR",
        message: "Servidor funcionando pero con problemas en la base de datos",
        timestamp: new Date().toISOString(),
        baseDatos: {
          estado: estados[estadoConexion] || "Desconocido",
          conectado: false,
          error: "No se pudo establecer conexión con MongoDB",
        },
        servidor: {
          puerto: HTTP_PORT,
          nodejs: process.version,
        },
      });
    }
  });

  // Rutas de autenticación (públicas).
  app.use("/auth", AuthRouter);

  // No permitir usuarios no autorizados a otras rutas.
  app.use(verifyToken);

  // Rutas de módulos
  app.use("/api/people", peopleRoutes);
  app.use("/api/users", usersRoutes);
  app.use("/api/organizations", organizationsRoutes);
  app.use("/api/modalities", modalitiesRoutes);

  app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on all interfaces, port 3000");
  });
}

module.exports = mainServer;

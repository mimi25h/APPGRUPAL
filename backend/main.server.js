// Main server configuration.
// Sets up Express, connects to MongoDB, registers global middlewares, and mounts module routes.
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { connectToMongo } = require("./database/config/db");

// Import shared middlewares (JWT token verification).
const { verifyToken } = require("./main.middlewares");

// Import route handlers for each resource module.
const AuthRouter = require("./modules/auth/routes");
const peopleRoutes = require("./modules/people/routes");
const usersRoutes = require("./modules/users/routes");
const organizationsRoutes = require("./modules/organizations/routes");
const modalitiesRoutes = require("./modules/modalities/routes");

// Flag to track whether MongoDB connected successfully at startup.
let mongoOk = false;

function mainServer() {
  const HTTP_PORT = process.env.HTTP_PORT || 3000;
  const app = express();

  // Apply global middlewares: CORS support, JSON body parsing, and URL-encoded form parsing.
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Establish MongoDB connection asynchronously when the server starts.
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

  // Public health check endpoint — returns server status and MongoDB connection details.
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

  // Public authentication routes (login, bootstrap-admin) — no token required.
  app.use("/auth", AuthRouter);

  // Apply JWT verification middleware — all routes registered after this point are protected.
  app.use(verifyToken);

  // Protected API routes — each resource module is mounted under /api/.
  app.use("/api/people", peopleRoutes);
  app.use("/api/users", usersRoutes);
  app.use("/api/organizations", organizationsRoutes);
  app.use("/api/modalities", modalitiesRoutes);

  app.listen(HTTP_PORT, "0.0.0.0", () => {
    console.log(`Server running on all interfaces, port ${HTTP_PORT}`);
  });
}

module.exports = mainServer;

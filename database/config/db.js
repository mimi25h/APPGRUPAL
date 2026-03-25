// Database connection utility.
// Provides a function to establish a MongoDB connection using Mongoose.
const mongoose = require("mongoose");

// Attempts to connect to MongoDB with the given URI.
// Returns { ok: true, dbName } on success, or { ok: false, error } on failure.
async function connectToMongo(uri) {
  try {
    if (!uri) {
      throw new Error("MONGO_URI no definida en el archivo de configuracion");
    }

    await mongoose.connect(uri);

    return {
      ok: true,
      dbName: mongoose.connection.db.databaseName,
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message,
    };
  }
}

module.exports = { connectToMongo };

const mongoose = require("mongoose");

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

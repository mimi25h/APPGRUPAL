// Mongoose schema and model for the Modality resource.
// Represents a medical or study modality with a human-readable name, a short code, and an active status.
const mongoose = require("mongoose");

// Schema fields: code_meaning (display label), code_value (short identifier), status (active/inactive).
const modalitySchema = new mongoose.Schema({
  code_meaning: { type: String, required: true },
  code_value: { type: String, required: true },
  status: { type: Boolean, default: true },
});

const Modalities = mongoose.model("modality", modalitySchema, "modalities");

module.exports = Modalities;

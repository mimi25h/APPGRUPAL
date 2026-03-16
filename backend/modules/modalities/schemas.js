const mongoose = require("mongoose");

const modalitySchema = new mongoose.Schema({
  code_meaning: { type: String, required: true },
  code_value: { type: String, required: true },
  status: { type: Boolean, default: true },
});

const modality = mongoose.model("modality", modalitySchema, "modalities");

module.exports = modality;

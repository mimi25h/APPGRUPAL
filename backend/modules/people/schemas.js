// Mongoose schema and model for the People resource.
// Represents a natural person with identification, names, birth date, gender, and contact info.
const mongoose = require("mongoose");

// Schema fields: document and name_01, surname_01, birth_date are required.
// name_02, surname_02, gender, and phone_numbers are optional.
const peopleSchema = new mongoose.Schema({
  document: { type: String, required: true },
  name_01: { type: String, required: true },
  name_02: { type: String },
  surname_01: { type: String, required: true },
  surname_02: { type: String },
  birth_date: { type: Date, required: true },
  gender: { type: Number },
  phone_numbers: { type: [String] },
});

const people = mongoose.model("people", peopleSchema, "people");

module.exports = people;

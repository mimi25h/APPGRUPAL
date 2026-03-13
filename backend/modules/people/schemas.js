const mongoose = require("mongoose");

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

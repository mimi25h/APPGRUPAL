const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  short_name: { type: String },
  country_code: { type: String },

  status: { type: Boolean, default: true },
});

const organization = mongoose.model(
  "organization",
  organizationSchema,
  "organizations",
);

module.exports = organization;

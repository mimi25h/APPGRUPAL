// Mongoose schema and model for the Organization resource.
// Represents an organization with a name, optional short name, country code, and active status.
const mongoose = require("mongoose");

// Schema fields: name (required), short_name, country_code (2-3 uppercase letters), status.
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

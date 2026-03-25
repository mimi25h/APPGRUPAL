// Handler: creates a new Organization document in the database.
const Organization = require("../schemas");

// Inserts a new organization using the sanitized body from req.parsedBody.
// Responds with 201 and the created document on success.
async function createOrganization(req, res) {
  try {
    const created = await Organization.create(req.parsedBody);
    res.status(201).json({ ok: true, data: created });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = createOrganization;

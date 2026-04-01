// Handler: creates a new Modality document in the database.
const Modalities = require("../schemas");

// Inserts a new modality using the sanitized body from req.parsedBody.
// Responds with 201 and the created document on success.
async function createModality(req, res) {
  try {
    const created = await Modalities.create(req.parsedBody);
    res.status(201).json({ ok: true, data: created });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = createModality;

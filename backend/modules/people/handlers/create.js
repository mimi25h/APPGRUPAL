// Handler: creates a new People (person) document in the database.
const People = require("../schemas");

// Inserts a new person using the sanitized body from req.parsedBody.
// Responds with 201 and the created document on success.
async function createPeople(req, res) {
  try {
    const created = await People.create(req.parsedBody);
    res.status(201).json({ ok: true, data: created });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = createPeople;

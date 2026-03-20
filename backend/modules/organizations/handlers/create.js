const Organization = require("../schemas");

async function createOrganization(req, res) {
  try {
    const created = await Organization.create(req.parsedBody);
    res.status(201).json({ ok: true, data: created });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = createOrganization;

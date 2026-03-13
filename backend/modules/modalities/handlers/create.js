const Modality = require("../schemas");

async function createModality(req, res) {
  try {
    const created = await Modality.create(req.parsedBody);
    res.status(201).json({ ok: true, data: created });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = createModality;

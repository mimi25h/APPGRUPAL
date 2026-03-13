const People = require("../schemas");

async function deletePeople(req, res) {
  try {
    const deleted = await People.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ ok: false, message: "Persona no encontrada" });
    }

    res.json({ ok: true, data: deleted });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = deletePeople;

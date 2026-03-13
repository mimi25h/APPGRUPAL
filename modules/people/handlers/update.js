const People = require("../schemas");

async function updatePeople(req, res) {
  try {
    const updated = await People.findByIdAndUpdate(
      req.params.id,
      req.parsedBody,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) {
      return res
        .status(404)
        .json({ ok: false, message: "Persona no encontrada" });
    }

    res.json({ ok: true, data: updated });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = updatePeople;

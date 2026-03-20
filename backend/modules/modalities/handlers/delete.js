const Modality = require("../schemas");

async function deleteModality(req, res) {
  try {
    const deleted = await Modality.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ ok: false, message: "Modalidad no encontrada" });
    }

    res.json({ ok: true, data: deleted });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = deleteModality;

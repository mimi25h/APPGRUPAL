const Modality = require("../schemas");

async function readModalities(req, res) {
  try {
    if (req.params.id) {
      const modality = await Modality.findById(req.params.id);
      if (!modality) {
        return res
          .status(404)
          .json({ ok: false, message: "Modalidad no encontrada" });
      }

      return res.json({ ok: true, data: modality });
    }

    const modalities = await Modality.find().sort({ _id: -1 });
    res.json({ ok: true, data: modalities });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = readModalities;

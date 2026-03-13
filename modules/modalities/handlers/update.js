const Modality = require("../schemas");

async function updateModality(req, res) {
  try {
    const updated = await Modality.findByIdAndUpdate(
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
        .json({ ok: false, message: "Modalidad no encontrada" });
    }

    res.json({ ok: true, data: updated });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = updateModality;

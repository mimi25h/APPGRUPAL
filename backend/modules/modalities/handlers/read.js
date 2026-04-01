// Handler: retrieves one or all Modality documents from the database.
const Modality = require("../schemas");
const { findById } = require("../../modules/modules.services");

// If req.params.id is present, fetches a single modality by ID.
// Otherwise, returns the full list sorted by newest first.
async function readModalities(req, res) {
  try {
    if (req.params.id) {
      const modality = await findById(Modality, req.params.id);
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

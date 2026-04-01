// Handler: retrieves one or all Organization documents from the database.
const Organization = require("../schemas");
const { findById } = require("../../modules/modules.services");

// If req.params.id is present, fetches a single organization by ID.
// Otherwise, returns the full list sorted by newest first.
async function readOrganizations(req, res) {
  try {
    if (req.params.id) {
      const organization = await findById(Organization, req.params.id);
      if (!organization) {
        return res
          .status(404)
          .json({ ok: false, message: "Organización no encontrada" });
      }

      return res.json({ ok: true, data: organization });
    }

    const organizations = await Organization.find().sort({ _id: -1 });
    res.json({ ok: true, data: organizations });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = readOrganizations;

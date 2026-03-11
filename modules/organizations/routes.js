const express = require("express");
const Organization = require("./schemas");
const { createOrganizationValidator } = require("./validators");
const { validateRequest } = require("../../main.middlewares");

const router = express.Router();

router.post(
  "/",
  createOrganizationValidator,
  validateRequest,
  async (req, res) => {
    try {
      const created = await Organization.create(req.body);
      res.status(201).json({ ok: true, data: created });
    } catch (error) {
      res.status(500).json({ ok: false, message: error.message });
    }
  },
);

module.exports = router;

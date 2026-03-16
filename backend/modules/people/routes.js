const jwt = require("jsonwebtoken");
const express = require("express");
const createPeople = require("./handlers/create");
const readPeople = require("./handlers/read");
const updatePeople = require("./handlers/update");
const deletePeople = require("./handlers/delete");
const {
  createPeopleValidator,
  peopleIdValidator,
  updatePeopleValidator,
} = require("./validators");
const { validateRequest } = require("../../main.middlewares");

const router = express.Router();

// --- LOGIN ROUTE FIRST ---
router.post("/login", async (req, res) => {
  const { document } = req.body;

  if (!document) {
    return res.status(400).json({ ok: false, message: "Document is required" });
  }

  const People = require("./schemas");

  try {
    const person = await People.findOne({ document });

    if (!person) {
      return res.status(404).json({ ok: false, message: "Person not found" });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        ok: false,
        message: "JWT_SECRET missing in environment variables",
      });
    }

    const token = jwt.sign(
      {
        id: person._id,
        document: person.document
      },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.json({
      ok: true,
      data: {
        person: {
          _id: person._id,
          name: person.name_01,
          surname: person.surname_01
        },
        token
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// --- REGULAR COLLECTION ROUTES ---
router.get("/", readPeople);
router.post("/", createPeopleValidator, validateRequest, createPeople);

// --- PARAMETERIZED ROUTES MUST COME LAST ---
router.get("/:id", peopleIdValidator, validateRequest, readPeople);
router.put("/:id", peopleIdValidator, updatePeopleValidator, validateRequest, updatePeople);
router.delete("/:id", peopleIdValidator, validateRequest, deletePeople);

module.exports = router;
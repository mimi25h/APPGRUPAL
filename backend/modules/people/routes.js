// PEOPLE
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
const { checkIsAdmin, verifyToken, validateRequest } = require("../../main.middlewares");

const Persons = require("./schemas");
const Users = require("../users/schemas");

const router = express.Router();

// All routes require admin
router.use(checkIsAdmin);

router.get("/", readPeople);
router.get("/:id", peopleIdValidator, validateRequest, readPeople);
router.post("/", createPeopleValidator, validateRequest, createPeople);
router.put(
  "/:id",
  peopleIdValidator,
  updatePeopleValidator,
  validateRequest,
  updatePeople,
);

router.delete('/:id', verifyToken, checkIsAdmin, async (req, res) => {
  const personId = req.params.id;
  const currentUserPersonId = req.token?.personId;

  try {
    const deletedPerson = await Persons.findByIdAndDelete(personId);
    if (!deletedPerson) return res.status(404).json({ message: 'Person not found', logout: false });

    await Users.deleteMany({ fk_person: personId });

    const logout = currentUserPersonId === personId;

    res.json({
      message: 'Person and all associated users deleted successfully',
      logout,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete person and users', logout: false });
  }
});

module.exports = router;
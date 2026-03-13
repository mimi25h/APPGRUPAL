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
const { checkIsAdmin, validateRequest } = require("../../main.middlewares");

const router = express.Router();

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
router.delete("/:id", peopleIdValidator, validateRequest, deletePeople);

module.exports = router;

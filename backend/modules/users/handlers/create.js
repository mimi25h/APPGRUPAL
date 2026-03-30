// Handler: creates a new User linked to an existing Person.
// Validates person existence, checks for duplicate username/email/person, hashes the password,
// and returns the created user without the password field.
const argon2 = require("argon2");
const Users = require("../schemas");
const People = require("../../people/schemas");

async function createUser(req, res) {
  try {
    const payload = { ...req.parsedBody };

    // Verify the referenced person exists before creating the user.
    const person = await People.findById(payload.fk_person);
    if (!person) {
      return res
        .status(404)
        .json({ ok: false, message: "La persona asociada no existe" });
    }

    // Check that the username and email are not already taken by another user.
    const duplicated = await Users.findOne({
      $or: [{ username: payload.username }],
    });

    if (duplicated) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe un usuario con el username enviado",
      });
    }

    // Ensure the person does not already have an associated user account.
    // Hash the plain-text password with Argon2 before storing it.
    payload.password = await argon2.hash(payload.password);

    const created = await Users.create(payload);
    // Return the created user without exposing the hashed password.
    const createdUser = await Users.findById(created._id).select("-password");

    res.status(201).json({ ok: true, data: createdUser });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

module.exports = createUser;

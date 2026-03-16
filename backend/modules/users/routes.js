const express = require("express");
const router = express.Router();
const Users = require("./schemas");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { createUserValidator } = require("./validators"); // if you have validators

// --- CREATE USER ---
router.post("/", createUserValidator, async (req, res) => {
  try {
    const { fk_person, username, email, password, role } = req.body;

    // check if the person already has a user
    const exists = await Users.findOne({ fk_person });
    if (exists) {
      return res.status(409).json({
        ok: false,
        message: "La persona enviada ya tiene un usuario asociado",
      });
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = await Users.create({
      fk_person,
      username,
      email,
      password: hashedPassword,
      role,
    });

    const safeUser = await Users.findById(newUser._id).select("-password");

    res.status(201).json({ ok: true, data: safeUser });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// --- USER LOGIN ---
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ ok: false, message: "Username and password required" });
  }

  try {
    const user = await Users.findOne({ username });
    if (!user) return res.status(404).json({ ok: false, message: "User not found" });

    const valid = await argon2.verify(user.password, password);
    if (!valid) return res.status(401).json({ ok: false, message: "Invalid password" });

    const token = jwt.sign(user.getJWTpayload(), process.env.JWT_SECRET, { expiresIn: "1h" });
    const safeUser = await Users.findById(user._id).select("-password");

    res.json({ ok: true, data: { user: safeUser, token } });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

module.exports = router;
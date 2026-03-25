// Mongoose schema and model for the Users resource.
// Represents a system user linked to a person, with credentials, role, preferences, and status.
const mongoose = require("mongoose");

// Schema fields: fk_person (reference to People), username, hashed password, email,
// role (1=Admin, 2=Viewer), settings (language/theme preferences), and active status.
const usersSchema = new mongoose.Schema(
  {
    fk_person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "people",
      required: true,
    },
    username: { type: String, required: true },
    password: { type: String },
    email: { type: String, required: true },
    role: {
      type: Number,
      required: true,
      enum: [1, 2],
    },
    settings: { language: { type: String }, theme: { type: String } },
    status: { type: Boolean, default: true },
  },
  {
    methods: {
      // Returns the payload object to be signed into the JWT token.
      getJWTpayload() {
        return {
          userId: this._id,
          personId: this.fk_person,
          role: this.role,
          settings: this.settings,
        };
      },
    },
  },
);

const users = mongoose.model("users", usersSchema, "users");

module.exports = users;

const mongoose = require("mongoose");

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
    role: { type: Number },
    settings: { language: { type: String }, theme: { type: String } },
    status: { type: Boolean, default: true },
  },
  {
    methods: {
      getJWTpayload() {
        return {
          id: this._id,
          role: this.role,
          settings: this.settings,
        };
      },
    },
  },
);

const users = mongoose.model("users", usersSchema, "users");

module.exports = users;

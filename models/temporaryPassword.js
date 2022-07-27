const mongoose = require("mongoose");

// Define schema
const Schema = mongoose.Schema;

const temporaryPassword = new Schema({
  email: String,
  password: String,
});

// Compile model from schema
const TemporaryPassword = mongoose.model(
  "TemporaryPassword",
  temporaryPassword
);

module.exports = {
  TemporaryPassword: TemporaryPassword,
};

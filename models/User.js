
// User model here
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dbConnection = require("../configs/db.config")

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  githubId: String,
  googleId: String,
  vacancies: [{
    type: Schema.Types.ObjectId,
    ref: 'Vacancy'
  }],
  role: {
    type: String,
    enum: ['personal', 'company'],
  },
  avatarUrl: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;

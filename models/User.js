
// User model here
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dbConnection = require("../configs/db.config")

const userSchema = new Schema({
  displayName: String,
  username: String,
  password: String,
  email: String,
  githubId: String,
  googleId: String,
  linkedinId: String,
  xingId: String,
  vacancies: [{
    type: Schema.Types.ObjectId,
    ref: 'Vacancy'
  }],
  role: {
    type: String,
    enum: ['professional', 'company'],
    default: 'professional'
  },
  avatarUrl: String
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    bio: { type: String, trim: true, default: "" },
    avatar: { type: String, trim: true, default: "" },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Métodos de senha e hash...
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  const hash = await bcrypt.hash(this.passwordHash, 12);
  this.passwordHash = hash;
  next();
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = String(this._id);
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

// Aqui garantimos que não tentaremos criar o modelo User duas vezes
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
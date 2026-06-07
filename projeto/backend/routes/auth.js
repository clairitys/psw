const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { getToken } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("username").trim().notEmpty().withMessage("O username é obrigatório"),
    body("email").isEmail().withMessage("E-mail inválido"),
    body("password").isLength({ min: 6 }).withMessage("A senha deve ter pelo menos 6 caracteres"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { username, email, password, name, bio } = req.body;

    try {
      const existingUser = await User.findOne({
        $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
      });

      if (existingUser) {
        return res.status(409).json({ error: "Username ou e-mail já estão em uso" });
      }

      const user = new User({
        username,
        email,
        name: name ? name.trim() : username,
        passwordHash: password,
        bio: bio || "",
      });

      await user.save();

      const userJson = user.toJSON();
      userJson.id = String(user._id);

      return res.status(201).json({
        message: "Conta criada com sucesso",
        user: userJson,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  [
    body("username").optional().trim(),
    body("email").optional().isEmail().withMessage("E-mail inválido"),
    body("password").notEmpty().withMessage("A senha é obrigatória"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    if (!username && !email) {
      return res.status(422).json({ error: "Username ou e-mail é obrigatório" });
    }

    try {
      const user = await User.findOne(
        username
          ? { username: username.toLowerCase() }
          : { email: email.toLowerCase() }
      );

      if (!user || !(await user.validatePassword(password))) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const token = getToken({ id: user._id });
      const userJson = user.toJSON();
      userJson.id = String(user._id);

      return res.status(200).json({
        message: "Login realizado com sucesso",
        token,
        user: userJson,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

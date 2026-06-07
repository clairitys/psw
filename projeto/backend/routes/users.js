const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { getToken, verifyToken, verifyAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

const serializeUser = (user) => {
  const json = user.toJSON();
  json.id = String(user._id);
  return json;
};

router.get("/me", verifyToken, async (req, res, next) => {
  try {
    res.json({ user: serializeUser(req.user) });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/me",
  verifyToken,
  upload.single("avatar"),
  [
    body("email").optional().isEmail().withMessage("E-mail inválido"),
    body("name").optional().trim().notEmpty().withMessage("Nome inválido"),
    body("bio").optional().isLength({ max: 500 }).withMessage("Bio deve ter no máximo 500 caracteres"),
    body("password").optional().isLength({ min: 6 }).withMessage("A senha deve ter pelo menos 6 caracteres"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, bio, password, currentPassword } = req.body;

    try {
      const user = req.user;

      if (password) {
        if (!currentPassword) {
          return res.status(422).json({ error: "Senha atual é obrigatória para alterar a senha" });
        }
        const valid = await user.validatePassword(currentPassword);
        if (!valid) {
          return res.status(401).json({ error: "Senha atual incorreta" });
        }
        user.passwordHash = password;
      }

      if (req.file) {
        user.avatar = `/uploads/${req.file.filename}`;
      } else if (req.body.avatar !== undefined && req.body.avatar !== "") {
        user.avatar = req.body.avatar;
      }

      if (name !== undefined && name !== "") user.name = name.trim();
      if (bio !== undefined) user.bio = bio;
      if (email !== undefined) {
        const normalized = email.toLowerCase().trim();
        const existing = await User.findOne({
          email: normalized,
          _id: { $ne: user._id },
        });
        if (existing) {
          return res.status(409).json({ error: "E-mail já está em uso" });
        }
        user.email = normalized;
      }

      await user.save();
      res.json({
        message: "Perfil atualizado com sucesso",
        user: serializeUser(user),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users.map((u) => serializeUser(u)));
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = getToken({ id: user._id });

    res.json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    res.status(500).json({ error: "Erro no servidor" });
  }
});
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (req.body.username) user.username = req.body.username.toLowerCase().trim();
    if (req.body.email) user.email = req.body.email.toLowerCase().trim();
    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.password) user.passwordHash = req.body.password;

    await user.save();
    res.json(serializeUser(user));
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar usuário' });
  }
});
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

module.exports = router;

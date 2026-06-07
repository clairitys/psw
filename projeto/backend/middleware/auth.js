const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "default-secret", {
    expiresIn: "8h",
  });
};

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de autenticação ausente" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "default-secret");
    const user = await User.findById(payload.id);

    if (!user) {
      return res.status(401).json({ error: "Usuário inválido" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};

// Nova "catraca" de segurança exclusiva para Administradores
const verifyAdmin = (req, res, next) => {
  // Como o verifyToken sempre roda antes, a variável req.user já vai existir aqui
  if (req.user && req.user.isAdmin === true) {
    next(); // Catraca liberada, pode passar!
  } else {
    return res.status(403).json({ error: "Acesso negado. Área restrita para Administradores." });
  }
};

module.exports = { getToken, verifyToken, verifyAdmin };
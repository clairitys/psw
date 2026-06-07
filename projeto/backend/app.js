const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const reviewRoutes = require("./routes/reviews");
const albumRoutes = require("./routes/Album");
const artistasRoutes = require("./routes/Artista"); 
const musicaRoutes = require("./routes/Musicas");
const listaRoutes = require("./routes/Listas");
const generosRoutes = require("./routes/Generos");

const { connectMongo } = require("./config/database");

connectMongo();

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS original
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/albuns", albumRoutes);
app.use("/api/artistas", artistasRoutes);
app.use("/api/generos", generosRoutes);
app.use("/api/musicas", musicaRoutes);
app.use("/api/listas", listaRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, "..")));

app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(404).json({ error: "Rota de API não encontrada" });
  }
  next();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Erro interno" });
});

module.exports = app;

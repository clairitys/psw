const express = require("express");
const { body, validationResult } = require("express-validator");
const Review = require("../models/Review");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

const router = express.Router();

// GET / - Listar todas as avaliações
router.get("/", async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate("user", "username name avatar")
      .populate("comentarios.user", "username avatar")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

// POST / - Criar uma nova avaliação
router.post(
  "/",
  verifyToken,
  [
    body("album").trim().notEmpty().withMessage("O álbum é obrigatório"),
    body("artist").trim().notEmpty().withMessage("O artista é obrigatório"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("A avaliação deve ser um número entre 1 e 5"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const review = new Review({
        ...req.body,
        user: req.user._id,
      });

      await review.save();
      await review.populate("user", "username name avatar");

      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /:id - Atualizar um review (autenticado e dono/admin)
router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Avaliação não encontrada" });
    }

    // Admin ou autor pode editar
    if (req.user.isAdmin || review.user.equals(req.user._id)) {
      review.album = req.body.album || review.album;
      review.artist = req.body.artist || review.artist;
      review.rating = req.body.rating || review.rating;
      review.comment = req.body.comment || review.comment;
      review.capa = req.body.capa || review.capa; // Permite atualizar a capa também se necessário
      
      await review.save();
      return res.json(review);
    }

    return res.status(403).json({ error: "Você não tem permissão para editar esta avaliação" });
  } catch (error) {
    next(error);
  }
});

// GET /:id - Buscar uma avaliação específica por ID
router.get("/:id", async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "username name avatar")
      .populate("comentarios.user", "username avatar");
    if (!review) {
      return res.status(404).json({ error: "Avaliação não encontrada" });
    }
    res.json(review);
  } catch (error) {
    next(error);
  }
});

// DELETE /:id - Deletar uma avaliação
router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Avaliação não encontrada" });
    }

    // Admin ou autor pode deletar
    if (req.user.isAdmin || review.user.equals(req.user._id)) {
      await review.deleteOne();
      return res.status(200).json({ message: "Avaliação removida" });
    }

    return res.status(403).json({ error: "Você não tem permissão para deletar esta avaliação" });
  } catch (error) {
    next(error);
  }
});

// POST /:id/comentarios - Adicionar comentário a uma review
router.post(
  "/:id/comentarios",
  verifyToken,
  [
    body("texto")
      .trim()
      .notEmpty()
      .withMessage("O comentário é obrigatório")
      .isLength({ max: 500 })
      .withMessage("O comentário não pode ter mais de 500 caracteres"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ error: "Avaliação não encontrada" });
      }

      const novoComentario = {
        texto: req.body.texto,
        user: req.user._id,
      };

      review.comentarios.push(novoComentario);
      await review.save();
      await review.populate("user", "username name avatar");
      await review.populate("comentarios.user", "username avatar");

      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /:id/comentarios/:comentarioId - Editar comentário
router.patch(
  "/:id/comentarios/:comentarioId",
  verifyToken,
  [
    body("texto")
      .trim()
      .notEmpty()
      .withMessage("O comentário é obrigatório")
      .isLength({ max: 500 })
      .withMessage("O comentário não pode ter mais de 500 caracteres"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ error: "Avaliação não encontrada" });
      }

      const comentario = review.comentarios.id(req.params.comentarioId);
      if (!comentario) {
        return res.status(404).json({ error: "Comentário não encontrado" });
      }

      if (req.user.isAdmin || comentario.user.equals(req.user._id)) {
        comentario.texto = req.body.texto;
        await review.save();
        await review.populate("user", "username name avatar");
        await review.populate("comentarios.user", "username avatar");
        return res.json(review);
      }

      return res.status(403).json({ error: "Você não tem permissão para editar este comentário" });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /:id/comentarios/:comentarioId - Deletar comentário
router.delete("/:id/comentarios/:comentarioId", verifyToken, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Avaliação não encontrada" });
    }

    const comentario = review.comentarios.id(req.params.comentarioId);
    if (!comentario) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }

    // Admin ou autor do comentário pode deletar
    if (req.user.isAdmin || comentario.user.equals(req.user._id)) {
      review.comentarios.id(req.params.comentarioId).deleteOne();
      await review.save();
      await review.populate("user", "username name avatar");
      await review.populate("comentarios.user", "username avatar");
      return res.json(review);
    }

    return res.status(403).json({ error: "Você não tem permissão para deletar este comentário" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
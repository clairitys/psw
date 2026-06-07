const express = require("express");
const { body, validationResult } = require("express-validator");
const Review = require("../models/Review");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate("user", "username name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

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
      await review.populate("user", "username name");

      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /:id - Atualizar um review (autenticado e admin)
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
      
      await review.save();
      return res.json(review);
    }

    return res.status(403).json({ error: "Você não tem permissão para editar esta avaliação" });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate("user", "username name");
    if (!review) {
      return res.status(404).json({ error: "Avaliação não encontrada" });
    }
    res.json(review);
  } catch (error) {
    next(error);
  }
});

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

module.exports = router;
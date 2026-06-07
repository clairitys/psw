const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Genero = require('../models/Genero');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const generos = await Genero.find().sort({ nome: 1 });
    res.json(generos);
  } catch (erro) {
    res.status(500).json({ error: 'Erro ao buscar gêneros' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const genero = await Genero.findById(req.params.id);
    if (!genero) return res.status(404).json({ error: 'Gênero não encontrado' });
    res.json(genero);
  } catch (erro) {
    res.status(500).json({ error: 'Erro ao buscar gênero' });
  }
});

router.post(
  '/',
  verifyToken,
  verifyAdmin,
  [
    body('nome').trim().notEmpty().withMessage('Nome do gênero é obrigatório'),
    body('descricao').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
      const generoExistente = await Genero.findOne({ nome: req.body.nome.trim() });
      if (generoExistente) {
        return res.status(409).json({ error: 'Gênero já existe' });
      }

      const novoGenero = new Genero({
        nome: req.body.nome.trim(),
        descricao: req.body.descricao?.trim() || '',
      });
      const generoSalvo = await novoGenero.save();
      res.status(201).json(generoSalvo);
    } catch (erro) {
      res.status(400).json({ error: 'Erro ao salvar gênero' });
    }
  }
);

router.put(
  '/:id',
  verifyToken,
  verifyAdmin,
  [
    body('nome').trim().notEmpty().withMessage('Nome do gênero é obrigatório'),
    body('descricao').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
      const genero = await Genero.findById(req.params.id);
      if (!genero) return res.status(404).json({ error: 'Gênero não encontrado' });

      genero.nome = req.body.nome.trim();
      genero.descricao = req.body.descricao?.trim() || '';
      await genero.save();
      res.json(genero);
    } catch (erro) {
      res.status(400).json({ error: 'Erro ao atualizar gênero' });
    }
  }
);

router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const genero = await Genero.findByIdAndDelete(req.params.id);
    if (!genero) return res.status(404).json({ error: 'Gênero não encontrado' });
    res.json({ message: 'Gênero deletado com sucesso' });
  } catch (erro) {
    res.status(500).json({ error: 'Erro ao deletar gênero' });
  }
});

module.exports = router;

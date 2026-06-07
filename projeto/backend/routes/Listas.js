const express = require('express');
const { body, validationResult } = require('express-validator');
const upload = require('../middleware/upload');
const router = express.Router();
const Lista = require('../models/Lista');
const { verifyToken } = require('../middleware/auth');

// Buscar todas as listas
router.get('/', async (req, res) => {
  try {
    const listas = await Lista.find().populate('usuarioId', 'username name');
    res.json(listas);
  } catch (erro) {
    res.status(500).json({ error: 'Erro ao buscar listas' });
  }
});

// Criar nova lista (autenticado)
router.post(
  '/',
  verifyToken,
  upload.single('capa'),
  [body('titulo').trim().notEmpty().withMessage('Título é obrigatório')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      let itens = req.body.itens || [];
      if (typeof itens === 'string') {
        try {
          itens = JSON.parse(itens);
        } catch (parseError) {
          itens = [itens];
        }
      }
      if (!Array.isArray(itens)) {
        itens = [itens].filter(Boolean);
      }

      const novaLista = new Lista({
        titulo: req.body.titulo,
        descricao: req.body.descricao || '',
        capa: req.file ? `/uploads/${req.file.filename}` : req.body.capa || 'img/default-list.jpg',
        usuarioId: req.user._id,
        itens,
      });
      const salva = await novaLista.save();
      res.status(201).json(salva);
    } catch (erro) {
      res.status(400).json({ error: 'Erro ao criar a lista' });
    }
  }
);

module.exports = router;
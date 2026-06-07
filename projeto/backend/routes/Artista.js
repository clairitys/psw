const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Artista = require('../models/Artista');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET / - Listar todos
router.get('/', async (req, res) => {
  try {
    const artistas = await Artista.find();
    res.json(artistas);
  } catch (erro) {
    res.status(500).json({ error: 'Erro ao buscar artistas' });
  }
});

// GET /:id - Buscar um artista
router.get('/:id', async (req, res) => {
  try {
    const artista = await Artista.findById(req.params.id);
    if (!artista) {
      return res.status(404).json({ error: 'Artista não encontrado' });
    }
    res.json(artista);
  } catch (erro) {
    res.status(500).json({ error: 'Erro ao buscar artista' });
  }
});

// POST / - Criar novo
router.post(
  '/',
  verifyToken,
  verifyAdmin,
  upload.single('foto'),
  async (req, res) => {
    try {
      const filePath = req.file ? `/uploads/${req.file.filename}` : req.body.foto || '';
      const novoArtista = new Artista({
        nome: req.body.nome,
        bio: req.body.bio || '',
        foto: filePath,
      });
      const artistaSalvo = await novoArtista.save();
      res.status(201).json(artistaSalvo);
    } catch (erro) {
      res.status(400).json({ error: 'Erro ao salvar' });
    }
  }
);

// PUT /:id - Atualizar
router.put('/:id', verifyToken, verifyAdmin, upload.single('foto'), async (req, res) => {
  try {
    const artista = await Artista.findById(req.params.id);
    if (!artista) return res.status(404).json({ error: 'Artista não encontrado' });

    artista.nome = req.body.nome || artista.nome;
    artista.bio = req.body.bio !== undefined ? req.body.bio : artista.bio;
    if (req.file) {
      artista.foto = `/uploads/${req.file.filename}`;
    } else if (req.body.foto !== undefined) {
      artista.foto = req.body.foto;
    }

    await artista.save();
    res.json(artista);
  } catch (erro) {
    res.status(400).json({ error: 'Erro ao atualizar' });
  }
});

// DELETE /:id - Deletar
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Artista.findByIdAndDelete(req.params.id);
    res.json({ message: 'Artista deletado com sucesso' });
  } catch (erro) {
    res.status(500).json({ error: 'Erro ao deletar' });
  }
});

module.exports = router;
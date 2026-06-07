const express = require('express');
const router = express.Router();
const Musica = require('../models/Musica');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Listar todas as músicas
router.get('/', async (req, res) => {
  try {
    const musicas = await Musica.find().populate('albumId');
    res.json(musicas);
  } catch (err) { res.status(500).json({ error: 'Erro ao buscar músicas' }); }
});

// Criar nova música
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const novaMusica = new Musica({
      numero: req.body.numero,
      titulo: req.body.titulo,
      tempo: req.body.tempo,
      albumId: req.body.albumId
    });
    await novaMusica.save();
    await novaMusica.populate('albumId');
    res.status(201).json(novaMusica);
  } catch (err) { res.status(400).json({ error: 'Erro ao cadastrar música' }); }
});

// Atualizar música
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const musica = await Musica.findByIdAndUpdate(req.params.id, 
      {
        numero: req.body.numero,
        titulo: req.body.titulo,
        tempo: req.body.tempo,
        albumId: req.body.albumId
      }, 
      { new: true }
    ).populate('albumId');
    res.json(musica);
  } catch (err) { res.status(400).json({ error: 'Erro ao atualizar música' }); }
});

// Deletar música
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Musica.findByIdAndDelete(req.params.id);
    res.json({ message: 'Música deletada' });
  } catch (err) { res.status(500).json({ error: 'Erro ao deletar música' }); }
});

module.exports = router;
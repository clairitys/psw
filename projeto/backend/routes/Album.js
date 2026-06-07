const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Album = require('../models/Album');
const Artista = require('../models/Artista');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET / - Buscar todos os álbuns (público)
router.get('/', async (req, res) => {
  try {
    const albuns = await Album.find().populate('artistaId');
    res.json(albuns);
  } catch (erro) {
    res.status(500).json({ error: 'Erro ao buscar o catálogo de álbuns' });
  }
});

// GET /:id - Buscar um álbum específico (público)
router.get('/:id', async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('artistaId');
    if (!album) {
      return res.status(404).json({ error: 'Álbum não encontrado' });
    }
    res.json(album);
  } catch (erro) {
    res.status(500).json({ error: 'Erro ao buscar o álbum' });
  }
});

// POST / - Adicionar um novo álbum (autenticado e admin)
router.post(
  '/',
  verifyToken,
  verifyAdmin,
  upload.single('capa'),
  [
    body('titulo').trim().notEmpty().withMessage('Título é obrigatório'),
    body('artistaId').notEmpty().withMessage('ID do artista é obrigatório'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { titulo, artistaId, data, generos, gravadora } = req.body;
      const filePath = req.file ? `/uploads/${req.file.filename}` : req.body.capa;

      // Verificar se artista existe
      const artista = await Artista.findById(artistaId);
      if (!artista) {
        return res.status(404).json({ error: 'Artista não encontrado' });
      }

      const albumData = {
        titulo,
        artistaId,
        capa: filePath || 'img/default-album.jpg',
        data,
        generos: typeof generos === 'string' && generos ? generos.split(',').map(g => g.trim()) : Array.isArray(generos) ? generos : [],
        gravadora: gravadora || 'Independente',
      };

      const novoAlbum = new Album(albumData);
      const albumSalvo = await novoAlbum.save();
      await albumSalvo.populate('artistaId');
      
      res.status(201).json(albumSalvo);
    } catch (erro) {
      res.status(400).json({ error: 'Erro ao salvar o álbum. Verifique os dados.' });
    }
  }
);

// PUT /:id - Atualizar um álbum (autenticado e admin)
router.put(
  '/:id',
  verifyToken,
  verifyAdmin,
  upload.single('capa'),
  [
    body('titulo').optional().trim().notEmpty().withMessage('Título não pode estar vazio'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { titulo, artistaId, data, generos, gravadora } = req.body;
      const filePath = req.file ? `/uploads/${req.file.filename}` : undefined;
      
      const album = await Album.findById(req.params.id);
      if (!album) {
        return res.status(404).json({ error: 'Álbum não encontrado' });
      }

      if (titulo) album.titulo = titulo;
      if (artistaId) album.artistaId = artistaId;
      if (filePath) album.capa = filePath;
      if (data) album.data = data;
      if (generos) {
        album.generos = typeof generos === 'string' && generos ? generos.split(',').map(g => g.trim()) : Array.isArray(generos) ? generos : album.generos;
      }
      if (gravadora) album.gravadora = gravadora;

      const albumAtualizado = await album.save();
      await albumAtualizado.populate('artistaId');
      
      res.json(albumAtualizado);
    } catch (erro) {
      res.status(400).json({ error: 'Erro ao atualizar o álbum' });
    }
  }
);

// DELETE /:id - Deletar um álbum (autenticado e admin)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Álbum não encontrado' });
    }
    res.json({ message: 'Álbum deletado com sucesso' });
  } catch (erro) {
    res.status(500).json({ error: 'Erro ao deletar o álbum' });
  }
});

module.exports = router;
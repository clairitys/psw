const mongoose = require('mongoose');

const ArtistaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  bio: { type: String, default: '' },
  foto: { type: String, default: '' }
});

/* Truque de Ouro: O MongoDB salva o ID como '_id', mas o seu React espera 'id'.
   Essa regrinha abaixo faz o backend traduzir isso automaticamente para você! */
ArtistaSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret.id || (doc._id && String(doc._id));
    delete ret._id;
  }
});

module.exports = mongoose.model('Artista', ArtistaSchema);
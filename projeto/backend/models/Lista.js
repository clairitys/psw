const mongoose = require('mongoose');

const ListaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, default: '' },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  capa: { type: String, default: 'img/default-list.jpg' },
  // Guarda os IDs das músicas ou álbuns adicionados
  itens: [{ type: mongoose.Schema.Types.ObjectId }] 
});

ListaSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret.id || (doc._id && String(doc._id));
    delete ret._id;
  }
});

module.exports = mongoose.model('Lista', ListaSchema);
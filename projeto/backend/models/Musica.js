const mongoose = require('mongoose');

const MusicaSchema = new mongoose.Schema({
  numero: { type: Number, required: true }, // Número da faixa no disco
  titulo: { type: String, required: true },
  tempo: { type: String, required: true }, // Ex: "3:45"
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true }
});

MusicaSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret.id || (doc._id && String(doc._id));
    delete ret._id;
  }
});

module.exports = mongoose.model('Musica', MusicaSchema);
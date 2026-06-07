const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  artistaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artista', required: true },
  capa: { type: String, default: 'img/default-album.jpg' },
  data: { type: String },
  generos: { type: [String], default: [] },
  gravadora: { type: String, default: 'Independente' },
  notaMedia: { type: Number, default: 0 }
});

AlbumSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret.id || (doc._id && String(doc._id));
    delete ret._id;
  }
});

module.exports = mongoose.model('Album', AlbumSchema);
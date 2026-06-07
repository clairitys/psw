const mongoose = require('mongoose');

const GeneroSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true, unique: true },
  descricao: { type: String, trim: true, default: '' },
});

GeneroSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret.id || (doc._id && String(doc._id));
    delete ret._id;
  },
});

module.exports = mongoose.models.Genero || mongoose.model('Genero', GeneroSchema);

const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
  imagen: { type: String, required: true },
  editorial: { type: String, required: true },
  personaje: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Comic', comicSchema);
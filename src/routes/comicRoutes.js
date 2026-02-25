const express = require('express');
const router = express.Router();
const Comic = require('../models/comic');
const { verificarToken, soloAdmin } = require('../middleware/auth');

// GET todos los comics (público)
router.get('/', async (req, res) => {
  try {
    const comics = await Comic.find();
    res.json(comics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST nuevo comic (solo admin)
router.post('/', verificarToken, soloAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, imagen, editorial, personaje } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
    const comic = new Comic({ nombre, descripcion, precio, stock, imagen, editorial, personaje });
    await comic.save();
    res.status(201).json(comic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT editar comic (solo admin)
router.put('/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    const comic = await Comic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(comic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE comic (solo admin)
router.delete('/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    await Comic.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Comic eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
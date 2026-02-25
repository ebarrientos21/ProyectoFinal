const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar usuario
const registrar = async (req, res) => {
  try {
    const { nombre, email, password, adminSecret } = req.body;

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const passwordEncriptado = await bcrypt.hash(password, 10);
    const rol = adminSecret === process.env.ADMIN_SECRET ? 'admin' : 'usuario';

    const usuario = new Usuario({
      nombre,
      email,
      password: passwordEncriptado,
      rol
    });

    await usuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', rol });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, rol: usuario.rol, nombre: usuario.nombre });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
  }
};

module.exports = { registrar, login };
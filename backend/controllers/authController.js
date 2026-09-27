const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User } = require('../models');
const { generateToken } = require('../config/jwt');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el correo o usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario o correo electrónico ya están registrados.' });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Crear usuario (rol por defecto: ROL_USUARIO)
    const user = await User.create({
      username,
      email,
      password_hash,
      role: 'ROL_USUARIO'
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Usuario registrado con éxito.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en el registro de usuario:', error);
    return res.status(500).json({ message: 'Error en el registro de usuario.', error: error.message, stack: error.stack });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'El usuario/correo y contraseña son obligatorios.' });
    }

    // Buscar por correo o nombre de usuario
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    return res.status(500).json({ message: 'Error en el inicio de sesión.', error: error.message, stack: error.stack });
  }
};

exports.getMe = async (req, res) => {
  try {
    // req.user ya fue adjuntado por el middleware
    return res.status(200).json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Error al obtener datos del perfil.', error);
    return res.status(500).json({ message: 'Error al obtener datos del perfil.' });
  }
};

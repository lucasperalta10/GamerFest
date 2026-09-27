const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');

// Importar Rutas
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const eventRoutes = require('./routes/eventRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS más flexible y robusta para producción y desarrollo
app.use(
  cors({
    origin: (origin, callback) => {
      // Si no hay origin (postman/mobile) o estamos en desarrollo/producción
      if (!origin) return callback(null, true);
      
      const allowedOrigins = process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(',').map((o) => o.trim().replace(/\/$/, ''))
        : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

      const cleanOrigin = origin.replace(/\/$/, '');

      // Permitir si coincide exactamente, si es wildcard, o si es un despliegue de Vercel
      if (
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app') ||
        cleanOrigin.includes('localhost') ||
        cleanOrigin.includes('127.0.0.1')
      ) {
        callback(null, true);
      } else {
        console.warn(`CORS bloqueado para el origen: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Servir archivos estáticos si en el futuro se suben imágenes localmente
// app.use('/uploads', express.static('uploads'));

// Montar Rutas
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/favorites', favoriteRoutes);

// Ruta de estado general
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Sincronizar Base de Datos y arrancar Servidor
async function startServer() {
  try {
    // Sincronizar modelos con la base de datos (sin borrar datos por defecto)
    await sequelize.authenticate();
    console.log('Conexión con MySQL establecida correctamente.');
    
    await sequelize.sync();
    console.log('Modelos de base de datos sincronizados.');

    app.listen(PORT, () => {
      console.log(`Servidor de GamerFest corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

startServer();

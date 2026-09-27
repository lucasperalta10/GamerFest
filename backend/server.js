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

// Ruta para disparar la importación del backup completo
app.get('/api/admin/seed-backup', async (req, res) => {
  try {
    const importBackup = require('./seeders/importBackup');
    const success = await importBackup();
    if (success) {
      return res.status(200).json({ message: 'Backup de XAMPP importado exitosamente en Railway.' });
    } else {
      return res.status(404).json({ message: 'No se encontró el archivo backup.sql en el servidor.' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Sincronizar Base de Datos y arrancar Servidor
async function startServer() {
  try {
    // Sincronizar modelos con la base de datos (sin borrar datos por defecto)
    await sequelize.authenticate();
    console.log('Conexión con MySQL establecida correctamente.');
    
    await sequelize.sync();
    console.log('Modelos de base de datos sincronizados.');

    // Verificar si la base de datos necesita la carga del backup completo de XAMPP
    const { Game } = require('./models');
    const importBackup = require('./seeders/importBackup');
    const gameCount = await Game.count();
    if (gameCount < 5) {
      console.log(`Pocos juegos detectados (${gameCount}). Importando datos completos de XAMPP...`);
      await importBackup();
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor de GamerFest corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

startServer();

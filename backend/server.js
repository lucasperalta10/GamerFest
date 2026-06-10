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

// Middlewares globales
app.use(cors());
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

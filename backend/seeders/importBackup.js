const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');

async function importBackup() {
  try {
    console.log('--- Importando datos completos desde backup.sql ---');
    
    const possiblePaths = [
      path.join(__dirname, '../backup.sql'),
      path.join(__dirname, '../../backup.sql'),
      path.join(process.cwd(), 'backup.sql'),
      path.join(process.cwd(), 'backend/backup.sql'),
    ];

    let sqlPath = possiblePaths.find(p => fs.existsSync(p));

    if (!sqlPath) {
      console.log('No se encontró el archivo backup.sql en ninguna ubicación.');
      return false;
    }

    console.log('Cargando backup desde:', sqlPath);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    const statements = sql
      .split(/;\r?\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

    for (const stmt of statements) {
      if (stmt.length > 5) {
        try {
          await sequelize.query(stmt);
        } catch (err) {
          console.warn('Aviso en ejecución SQL:', err.message);
        }
      }
    }

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('--- Importación de datos de XAMPP completada con éxito ---');
    return true;
  } catch (error) {
    console.error('Error durante la importación del backup:', error);
    throw error;
  }
}

module.exports = importBackup;

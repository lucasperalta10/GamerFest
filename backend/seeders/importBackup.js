const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');

async function importBackup() {
  try {
    console.log('--- Importando datos completos desde backup.sql ---');
    const sqlPath = path.join(__dirname, '../backup.sql');
    if (!fs.existsSync(sqlPath)) {
      console.log('No se encontró backend/backup.sql, saltando importación.');
      return;
    }
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    // Dividir sentencias SQL por punto y coma al final de línea
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
  } catch (error) {
    console.error('Error durante la importación del backup:', error);
  }
}

module.exports = importBackup;

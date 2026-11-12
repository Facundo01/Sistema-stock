const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./usuario');

const planillaRacion = sequelize.define('planillaRacion', {
  id_planilla: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },
  fecha_creacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  tipo_comida: {
    type: DataTypes.STRING, // Ej: 'Almuerzo', 'Cena', 'Desayuno'
    allowNull: false
  }
}, {
  tableName: 'planillas_raciones',
  timestamps: true
});

// Relación: Un usuario crea muchas planillas de raciones
Usuario.hasMany(planillaRacion, { foreignKey: 'id_usuario' });
planillaRacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = planillaRacion;
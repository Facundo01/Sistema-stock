const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Paciente = require('./paciente');

const Menu = sequelize.define('Menu', {
  id_menu: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_paciente: {
    type: DataTypes.INTEGER,
    allowNull: true, // Opcional por si es un menú general, pero idealmente asociado a un paciente
    references: {
      model: Paciente,
      key: 'id_paciente'
    },
    onDelete: 'SET NULL'
  },
  nombre_menu: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion_dieta: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'menus',
  timestamps: true
});

// Relación: Un paciente puede tener un menú asignado
Paciente.hasMany(Menu, { foreignKey: 'id_paciente', onDelete: 'SET NULL' });
Menu.belongsTo(Paciente, { foreignKey: 'id_paciente' });

module.exports = Menu;
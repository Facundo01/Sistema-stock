const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const sector = sequelize.define('sector', {
  id_sector: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_sector: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'sectores_destinatarios',
  timestamps: true
});

module.exports = sector;
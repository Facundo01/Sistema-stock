const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Paciente = sequelize.define('Paciente', {
  id_paciente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dni: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  patologia: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Ninguna / General'
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  habitacion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cama: {
    type: DataTypes.STRING,
    allowNull: true
  },
  acompanante: {
    type: DataTypes.STRING,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'pacientes',
  timestamps: true
});

module.exports = Paciente;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Producto = sequelize.define('Producto', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_producto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  unidad_base: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stock_minimo: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  stock_actual: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'productos',
  timestamps: true
});

module.exports = Producto;
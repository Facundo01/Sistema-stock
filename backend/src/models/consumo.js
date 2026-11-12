const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');
const Producto = require('./producto');

const Consumo = sequelize.define('Consumo', {
  id_consumo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  consumo_directo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  cantidad_consumida: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  fecha_consumo: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'consumos',
  timestamps: true
});

// Asociaciones seguras alineadas al diagrama relacional
Consumo.belongsTo(Usuario, { foreignKey: 'id_usuario', targetKey: 'id_usuario', constraints: false });
Usuario.hasMany(Consumo, { foreignKey: 'id_usuario', constraints: false });

Consumo.belongsTo(Producto, { foreignKey: 'id_producto', constraints: false });
Producto.hasMany(Consumo, { foreignKey: 'id_producto', constraints: false });

module.exports = Consumo;
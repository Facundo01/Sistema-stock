const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const producto = require('./producto');

const lote = sequelize.define('lote', {
  id_lote: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: producto,
      key: 'id_producto'
    }
  },
  numero_lote: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha_adquisicion: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fecha_vencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  cantidad_inicial: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  cantidad_actual: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'lotes_stock',
  timestamps: true
});

// Definir la relación (Un producto tiene muchos lotes, un lote pertenece a un producto)
producto.hasMany(lote, { foreignKey: 'id_producto' });
lote.belongsTo(producto, { foreignKey: 'id_producto' });

module.exports = lote;
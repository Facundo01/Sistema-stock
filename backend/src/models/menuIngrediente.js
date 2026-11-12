const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const menu = require('./menu');
const producto = require('./producto');

const menuIngrediente = sequelize.define('menuIngrediente', {
  id_menu: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: menu,
      key: 'id_menu'
    }
  },
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: producto,
      key: 'id_producto'
    }
  },
  cantidad_ingrediente: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  unidad_medida: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'menu_ingredientes',
  timestamps: true
});

// Relaciones N:N mediante la tabla intermedia menuIngrediente
menu.belongsToMany(producto, { through: menuIngrediente, foreignKey: 'id_menu' });
producto.belongsToMany(menu, { through: menuIngrediente, foreignKey: 'id_producto' });

menu.hasMany(menuIngrediente, { foreignKey: 'id_menu' });
menuIngrediente.belongsTo(menu, { foreignKey: 'id_menu' });

producto.hasMany(menuIngrediente, { foreignKey: 'id_producto' });
menuIngrediente.belongsTo(producto, { foreignKey: 'id_producto' });

module.exports = menuIngrediente;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const planillaRacion = require('./planillaRacion');
const menu = require('./menu');

const detallePlanillaMenu = sequelize.define('detallePlanillaMenu', {
  id_planilla: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: planillaRacion,
      key: 'id_planilla'
    }
  },
  id_menu: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: menu,
      key: 'id_menu'
    }
  },
  cantidad_raciones: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'detalle_planilla_menu',
  timestamps: true
});

// Relaciones N:N
planillaRacion.belongsToMany(menu, { through: detallePlanillaMenu, foreignKey: 'id_planilla' });
menu.belongsToMany(planillaRacion, { through: detallePlanillaMenu, foreignKey: 'id_menu' });

planillaRacion.hasMany(detallePlanillaMenu, { foreignKey: 'id_planilla' });
detallePlanillaMenu.belongsTo(planillaRacion, { foreignKey: 'id_planilla' });

menu.hasMany(detallePlanillaMenu, { foreignKey: 'id_menu' });
detallePlanillaMenu.belongsTo(menu, { foreignKey: 'id_menu' });

module.exports = detallePlanillaMenu;
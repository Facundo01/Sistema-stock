const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const planillaRacion = require('./planillaRacion');
const sector = require('./sector');

const planillaSector = sequelize.define('planillaSector', {
  id_planilla: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: planillaRacion,
      key: 'id_planilla'
    }
  },
  id_sector: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: sector,
      key: 'id_sector'
    }
  },
  raciones_solicitadas: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'planilla_sectores',
  timestamps: true
});

// Relaciones N:N
planillaRacion.belongsToMany(sector, { through: planillaSector, foreignKey: 'id_planilla' });
sector.belongsToMany(planillaRacion, { through: planillaSector, foreignKey: 'id_sector' });

planillaRacion.hasMany(planillaSector, { foreignKey: 'id_planilla' });
planillaSector.belongsTo(planillaRacion, { foreignKey: 'id_planilla' });

sector.hasMany(planillaSector, { foreignKey: 'id_sector' });
planillaSector.belongsTo(sector, { foreignKey: 'id_sector' });

module.exports = planillaSector;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./usuario');

const ReporteFaltante = sequelize.define('ReporteFaltante', {
  id_reporte: {
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
    },
    onDelete: 'CASCADE'
  },
  producto_solicitado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cantidad_necesaria: {
    type: DataTypes.STRING,
    allowNull: true
  },
  urgencia: {
    type: DataTypes.STRING,
    defaultValue: 'Normal'
  },
  observacion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resuelto: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'reportes_faltantes',
  timestamps: true
});

Usuario.hasMany(ReporteFaltante, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
ReporteFaltante.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = ReporteFaltante;
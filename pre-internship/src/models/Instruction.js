const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Admin = require('./Admin');

const Instruction = sequelize.define('Instruction', {
  instruction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  admin_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Admin,
      key: 'admin_id'
    }
  },
  instruction_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Instructions',
  timestamps: false
});

Instruction.belongsTo(Admin, { foreignKey: 'admin_id' });

module.exports = Instruction;
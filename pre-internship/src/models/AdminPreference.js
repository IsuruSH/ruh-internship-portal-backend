const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Admin = require('./Admin');

const AdminPreference = sequelize.define('AdminPreference', {
  admin_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Admin,
      key: 'admin_id'
    }
  },
  preference_count: {
    type: DataTypes.INTEGER
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Admin_Preference',
  timestamps: false
});

AdminPreference.belongsTo(Admin, { foreignKey: 'admin_id' });

module.exports = AdminPreference;
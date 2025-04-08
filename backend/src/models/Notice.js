// models/Notice.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Notice = sequelize.define(
    "Notice",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      topic: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      isImportant: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      paranoid: true,
      deletedAt: "deletedAt",
      tableName: "Notices",
      indexes: [
        {
          fields: ["isImportant"],
        },
        {
          fields: ["expiresAt"],
        },
      ],
    }
  );

  return Notice;
};

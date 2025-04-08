const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Instruction = sequelize.define(
    "Instruction",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
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
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users", // Assuming you have a Users table
          key: "id",
        },
      },
    },
    {
      paranoid: true,
      deletedAt: "deletedAt",
      tableName: "Instructions",
      indexes: [
        {
          fields: ["isActive"],
        },
        {
          fields: ["updatedBy"],
        },
      ],
    }
  );

  Instruction.associate = (models) => {
    Instruction.belongsTo(models.User, {
      foreignKey: "updatedBy",
      as: "editor",
    });
  };

  return Instruction;
};

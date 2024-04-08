const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const BaseLink = sequelize.define('BaseLink', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  originLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  paranoid: true,
});

BaseLink.associate = (models) => {
  BaseLink.hasMany(models.Redirect, {
    onDelete: 'SET NULL',
    foreignKey: {
      allowNull: false,
    },
  });
};

module.exports = BaseLink;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/sequelize');

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
}, {
  paranoid: true,
});

module.exports = BaseLink;

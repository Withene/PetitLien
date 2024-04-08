const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Redirect = sequelize.define('Redirect', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  encurtedLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numberOfAccess: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  paranoid: true,
});

Redirect.associate = (models) => {
  Redirect.belongsTo(models.BaseLink, {
    foreignKey: {
      field: 'base_link_id',
      allowNull: false,
    },
    onDelete: 'SET NULL',
  });

  Redirect.belongsTo(models.User, {
    foreignKey: {
      field: 'user_id',
    },
    onDelete: 'SET NULL',
  });
};

Redirect.afterFind((instance, options) => {
  if (instance && options.hookOptions && options.hookOptions.needIncrementAccess === true) {
    // eslint-disable-next-line no-param-reassign
    instance.numberOfAccess = (instance.numberOfAccess || 0) + 1;
    return instance.save();
  }
  return true;
});

module.exports = Redirect;

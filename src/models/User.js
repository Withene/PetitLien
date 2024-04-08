const { DataTypes } = require('sequelize');
const { hash, compare } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const dotenv = require('dotenv');
const { sequelize } = require('../config/sequelize');

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const UserModel = sequelize.define(
  'User',
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
  },
  {
    paranoid: true,
    hooks: {
      beforeCreate: async (user) => {
        const saltRounds = 10;
        // eslint-disable-next-line no-param-reassign
        user.password_hash = await hash(user.password_hash, saltRounds);
      },
    },
  },
);
UserModel.prototype.generateToken = function generateToken() {
  return sign({ id: this.id }, process.env.APP_SECRET, { expiresIn: '1hr' });
};

UserModel.prototype.checkPassword = async function checkPassword(password) {
  // eslint-disable-next-line no-return-await
  return await compare(password, this.password_hash);
};

UserModel.associate = (models) => {
  UserModel.hasMany(models.Redirect, {
    onDelete: 'SET NULL',
  });
};

module.exports = UserModel;

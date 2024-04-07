const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const config = {
  logging: false,
  dialect: 'postgres',
  username: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    timezone: '-03:00',
  },
};

const sequelize = new Sequelize(config);
module.exports = { sequelize };

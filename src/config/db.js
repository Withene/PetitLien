const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { sequelize } = require('./sequelize');

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const models = {};

// Abstração dos imports de modulos.
fs.readdirSync(path.join(__dirname, '..', 'models'))
  .filter((file) => file.endsWith('.js') && file !== 'index.js')
  .forEach((file) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const model = require(path.join(__dirname, '..', 'models', file));
    models[model.name] = model;
  });

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.info('[SEQUELIZE] Sync successful.');
  } catch (error) {
    console.info('[SEQUELIZE] Err on connect in database:', error);
  }
}

module.exports = { sequelize, syncDatabase };

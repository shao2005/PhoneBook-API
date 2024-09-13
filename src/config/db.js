const { Sequelize } = require('sequelize');

// Create a connection to the PostgreSQL database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres'
});
sequelize.sync();
module.exports = sequelize;

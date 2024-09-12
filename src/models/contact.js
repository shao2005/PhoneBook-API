const { DataTypes } = require('sequelize');
const db = require('../config/db');

// Define Contact model
const Contact = db.define('Contact', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.STRING,
  },
});

module.exports = Contact;

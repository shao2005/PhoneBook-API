require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contactRoutes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/contacts', contactRoutes);

// Database Connection
db.authenticate()
  .then(() => console.log('Database connected.'))
  .catch(err => console.log('Error: ' + err));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

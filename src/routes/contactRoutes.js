const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Define API routes
router.get('/', contactController.getContacts);
router.get('/search', contactController.searchContacts);
router.post('/add', contactController.addContact);
router.put('/update', contactController.updateContact);
router.delete('/delete', contactController.deleteContact);

module.exports = router;

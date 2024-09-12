const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Define API routes
router.get('/', contactController.getContacts);
router.get('/search', contactController.searchContacts);
router.post('/', contactController.addContact);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;

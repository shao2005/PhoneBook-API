const contactService = require('../services/contactService');

// Get contacts with pagination (max 10 per page)
exports.getContacts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const contacts = await contactService.getContacts(page, limit);
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
};

// Search contacts by name
exports.searchContacts = async (req, res) => {
    try {
        const { name } = req.query;
        const contacts = await contactService.searchContacts(name);
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error searching contacts', error: error.message });
    }
};

// Add a new contact
exports.addContact = async (req, res) => {
    try {
        const contact = await contactService.addContact(req.body);
        // status code 201: the request was successfully fulfilled and resulted in one or possibly multiple new resources being created
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Error adding contact', error: error.message });
    }
};

// Update a contact
exports.updateContact = async (req, res) => {
    try {
        const contact = await contactService.updateContact(req.params.id, req.body);
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Error updating contact', error: error.message });
    }
};

// Delete a contact
exports.deleteContact = async (req, res) => {
    try {
        await contactService.deleteContact(req.params.id);
        // status code 204: the request has been successfully completed, but no response payload body will be present
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error: error.message });
    }
};

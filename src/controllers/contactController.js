const contactService = require('../services/contactService');

exports.getContacts = async (req, res) => {
    try {
        const { page = 1, limit = 10, order = "id" } = req.query;
        const contacts = await contactService.getContacts(page, limit, order);
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
};

exports.searchContacts = async (req, res) => {
    try {
        const { name } = req.query;
        const contacts = await contactService.searchContacts(name);
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error searching contacts', error: error.message });
    }
};

exports.addContact = async (req, res) => {
    try {
        const error = validateContact(req.body);
        if (error) {
            return res.status(400).json({ error });
        }
        const contact = await contactService.addContact(req.body);
        // status code 201: the request was successfully fulfilled and resulted in one or possibly multiple new resources being created
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Error adding contact', error: error.message });
    }
};

exports.updateContact = async (req, res) => {
    try {
        const contact = await contactService.updateContact(req.query.id, req.body);
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Error updating contact', error: error.message });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        await contactService.deleteContact(req.query.id);
        // status code 204: the request has been successfully completed, but no response payload body will be present
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error: error.message });
    }
};

const validateContact = (contact) => {
    const { firstName, lastName, phone } = contact;
    if (!firstName || !lastName || !phone) {
      return 'Validation error: firstName, lastName, and phone are required';
    }
    return null;
  };
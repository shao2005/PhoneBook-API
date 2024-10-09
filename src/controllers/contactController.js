const contactService = require('../services/contactService');
const logger = require('../utils/logger');

exports.getContacts = async (req, res) => {
    try {
        const { page = 1, limit = 10, order = "id" } = req.query;
        logger.info(`Getting all contacts - Page: ${page}, Limit: ${limit}, Order by: ${order}`);
        const contacts = await contactService.getContacts(page, limit, order);
        logger.info(`Got ${contacts.count} contact${contacts.count > 1 ? 's' : ''}`);
        res.json(contacts);
    } catch (error) {
        logger.error(`Failed getting all contacts: ${error.message}`);
        res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
};

exports.searchContacts = async (req, res) => {
    try {
        const { name } = req.query;
        logger.info(`Searching for contacts with name: ${name}`);
        const contacts = await contactService.searchContacts(name);
        if (contacts.length === 0) {
            logger.error('No contacts found');
            return res.status(404).json({ message: 'No contacts found' });
        }
        logger.info(`${contacts.length} contact${contacts.length > 1 ? 's' : ''} found`);
        res.json(contacts);
    } catch (error) {
        logger.error(`Failed searching: ${error.message}`);
        res.status(500).json({ message: 'Error searching contacts', error: error.message });
    }
};

exports.addContact = async (req, res) => {
    try {
        logger.info('Adding a new contact');
        const error = validateContact(req.body);
        if (error) {
            logger.error(`Validation error: ${error}`);
            return res.status(400).json({ error });
        }
        const contact = await contactService.addContact(req.body);
        logger.info(`Contact created: ID: ${contact.id}, Name: ${contact.firstName} ${contact.lastName}, Phone: ${contact.phone}`);
        // status code 201: the request was successfully fulfilled and resulted in one or possibly multiple new resources being created
        res.status(201).json(contact);
    } catch (error) {
        logger.error(`Failed to add contact: ${error.message}`);
        const statusCode = errorStatusCode(error.message);
        res.status(statusCode).json({ message: 'Error adding contact', error: error.message });
    }
};

exports.updateContact = async (req, res) => {
    try {
        const contactId = req.query.id;
        logger.info(`Attempting to update contact with ID: ${contactId}`);
        const error = hasWhitespace(req.body);
        if (error) {
            logger.error(`Validation error: ${error}`);
            return res.status(400).json({ error });
        }
        const contact = await contactService.updateContact(contactId, req.body);
        logger.info(`Contact updated: ${contact.firstName} ${contact.lastName}, Phone: ${contact.phone}`);
        res.json(contact);
    } catch (error) {
        logger.error(`Failed to update contact: ${error.message}`);
        const statusCode = errorStatusCode(error.message);
        res.status(statusCode).json({ message: 'Error updating contact', error: error.message });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        const contactId = req.query.id;
        logger.info(`Attempting to delete contact with ID: ${contactId}`);
        await contactService.deleteContact(contactId);
        logger.info(`Contact with ID ${contactId} deleted`);
        // status code 204: the request has been successfully completed, but no response payload body will be present
        res.status(200).json({id: contactId});
    } catch (error) {
        logger.error(`Failed to delete contact: ${error.message}`);
        const statusCode = errorStatusCode(error.message);
        res.status(statusCode).json({ message: 'Error deleting contact', error: error.message });
    }
};

const validateContact = (contact) => {
    const { firstName, lastName, phone } = contact;
    if (!firstName || !lastName || !phone) {
      return 'Validation error: firstName, lastName, and phone are required';
    }
    return hasWhitespace(contact);
};

const hasWhitespace = (contact) => {
    const {firstName, lastName} = contact;
    const hasSpaces = /\s/.test(firstName) || /\s/.test(lastName);
    if (hasSpaces) {
        return 'Validation error: firstName and lastName cannot contain spaces. Use a hyphen (-) instead.';
    }
    return null;
};

const errorStatusCode = (errorMessage) => {
    if(errorMessage === 'Contact not found'){
        return 404;
    }
    if(errorMessage === 'Validation error'){
        return 409;
    }
    return 500;
}
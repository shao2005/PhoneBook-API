const Contact = require('../models/contact');
const { Op } = require("sequelize");

// Get contacts with pagination
exports.getContacts = async (page, limit) => {
    const offset = (page - 1) * limit;
    return await Contact.findAndCountAll({
        limit,
        offset,
    });
};

// Search contacts by name (first or last name)
exports.searchContacts = async (name) => {
    let contact;
    const splitName = name.split(" ");
    if (splitName.length > 1){
        contact =  await Contact.findAll({
            where: {
                [Op.or]: [
                    {[Op.and] : [
                        { firstName: { [Op.iLike]: `%${splitName[0]}%` } },
                        { lastName: { [Op.iLike]: `%${splitName[1]}%` } }
                    ]}, 
                    {[Op.and] : [
                        { firstName: { [Op.iLike]: `%${splitName[1]}%` } },
                        { lastName: { [Op.iLike]: `%${splitName[0]}%` } }
                    ]}
                ]
            }
        });
    } else {
        contact =  await Contact.findAll({
            where: {
                [Op.or]: [
                    { firstName: { [Op.iLike]: `%${name}%` } },
                    { lastName: { [Op.iLike]: `%${name}%` } }
                ]
            }
        });
    }
    return contact;
};

// Add a new contact
exports.addContact = async (data) => {
    // validate data !!!
    return await Contact.create(data);
};

// Update a contact
exports.updateContact = async (id, data) => {
    const contact = await Contact.findByPk(id);
    if (contact) {
        return await contact.update(data);
    }
    throw new Error('Contact not found');
};

// Delete a contact
exports.deleteContact = async (id) => {
    const contact = await Contact.findByPk(id);
    if (contact) {
        return await contact.destroy();
    }
    throw new Error('Contact not found');
};

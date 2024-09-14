const request = require('supertest');
const {app, server} = require('../src/index');
const db = require('../src/config/db');
const Contact = require('../src/models/contact');

describe('Contacts API', () => {
  // Before all tests, sync database
  beforeAll(async () => {
    await db.sync({ force: true });
  });

  // Clean up after each test
  afterEach(async () => {
    await Contact.destroy({ where: {} });
  });

  // Close the DB and server connection after all tests
  afterAll(async () => {
    await db.close();
    server.close();
  });

  // Add a new contact
  it('should create a new contact', async () => {
    const newContact = {
      firstName: 'Avi',
      lastName: 'Levi',
      phone: '123456789',
      address: '23 Jaffa St.',
    };

    const res = await request(app).post('/contacts/add').send(newContact);

    expect(res.statusCode).toBe(201);
    expect(res.body.firstName).toBe('Avi');
    expect(res.body.lastName).toBe('Levi');
    expect(res.body.phone).toBe('123456789');
    expect(res.body.address).toBe('23 Jaffa St.');
  });

    // Add a new contact with missing fields
  it('should return validation error if required fields are missing', async () => {
    const incompleteContact = {
      firstName: 'Avi',
    };

    const res = await request(app).post('/contacts/add').send(incompleteContact);

    expect(res.statusCode).toBe(400); // Bad Request
    expect(res.body.error).toBe('Validation error: firstName, lastName, and phone are required');
  });

  // Get all contacts with pagination
  it('should get contacts with pagination', async () => {
    // Create some dummy contacts
    await Contact.bulkCreate([
      { firstName: 'Avi', lastName: 'Levi', phone: '123456789', address: '123 Jaffa St' },
      { firstName: 'Batia', lastName: 'Malka', phone: '987654321', address: '456 Eilat St' },
      { firstName: 'Coral', lastName: 'Hagag', phone: '9821', address: '456 Eilat St' },
      { firstName: 'Dalia', lastName: 'Nissim', phone: '54321', address: '456 Eilat St' },
      { firstName: 'Einat', lastName: 'Zeituni', phone: '987654', address: '456 Eilat St' },
      { firstName: 'Fanny', lastName: 'Shushani', phone: '21', address: '456 Eilat St' },
      { firstName: 'Gershon', lastName: 'Garashvili', phone: '444', address: '456 Eilat St' },
      { firstName: 'Haim', lastName: 'Batat', phone: '33336', address: '456 Eilat St' },
      { firstName: 'Itzik', lastName: 'Zohar', phone: '8886', address: '456 Eilat St' },
      { firstName: 'Julia', lastName: 'Roberts', phone: '2235', address: '456 Eilat St' },
      { firstName: 'Keren', lastName: 'Mor', phone: '56756', address: '456 Eilat St' },
      { firstName: 'Lotem', lastName: 'Albuher', phone: '7987987', address: '456 Eilat St' },
      { firstName: 'Menny', lastName: 'Malka', phone: '2', address: '456 Eilat St' }
    ]);

    const res = await request(app).get('/contacts');

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(13);
    expect(res.body.rows.length).toBe(10);
  });

  // Search contact by name
  it('should search for contacts by first and/or last name', async () => {
    // Add some dummy contacts
    await Contact.bulkCreate([
        { firstName: 'Avi', lastName: 'Levi', phone: '123456789', address: '123 Jaffa St' },
        { firstName: 'Batia', lastName: 'Malka', phone: '987654321', address: '456 Eilat St' }
    ]);

    const res = await request(app).get('/contacts/search?name=Avi');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].firstName).toBe('Avi');
    expect(res.body[0].lastName).toBe('Levi');
  });

   // Search for a non-existent contact
   it('should return empty result when searching for non-existent contact', async () => {
    const res = await request(app).get('/contacts/search?name=NonExistingName');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0); 
  });

  // Update contact
  it('should update an existing contact', async () => {
    // Add a contact to update
    const contact = await Contact.create({ firstName: 'Avi', lastName: 'Levi', phone: '123456789', address: '123 Jaffa St' });

    const res = await request(app).put(`/contacts/update?id=${contact.id}`).send({
      firstName: 'Shmuel',
      lastName: 'Sarusi',
      phone: '2846555'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe('Shmuel');
    expect(res.body.lastName).toBe('Sarusi');
    expect(res.body.phone).toBe('2846555');
    expect(res.body.address).toBe('123 Jaffa St');
  });

   // Update non-existent contact
   it('should return error when updating a non-existent contact', async () => {
    const res = await request(app).put('/contacts/update?id=999').send({
      firstName: 'Update',
      lastName: 'last',
      phone: '1230'
    });

    expect(res.statusCode).toBe(500); 
    expect(res.body.error).toBe('Contact not found');
  });

  // Delete contact
  it('should delete a contact', async () => {
    // Add a contact to delete
    const contact = await Contact.create({ firstName: 'Aaa', lastName: 'Bbb', phone: '12345' });

    const res = await request(app).delete(`/contacts/delete?id=${contact.id}`);

    expect(res.statusCode).toBe(204);
  });

  // Delete non-existent contact
  it('should return error when deleting a non-existent contact', async () => {
    const res = await request(app).delete('/contacts/delete?id=999');

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Contact not found');
  });
});

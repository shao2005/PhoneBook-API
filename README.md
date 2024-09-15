# Phonebook Web Server API

A simple phonebook application that provides an API for managing contacts. The API supports basic CRUD operations like adding, editing, deleting, and searching contacts. The application is built using **Node.js**, **PostgreSQL**, and **Sequelize**, and is containerized using **Docker**.

## Features
- **Add Contact**: Add a new contact with a first name, last name, phone number, and address.
- **Edit Contact**: Edit the details of an existing contact.
- **Delete Contact**: Remove a contact from the phonebook.
- **Get Contacts**: Retrieve a list of contacts (paginated).
- **Search Contact**: Search for a contact by first name, last name, or full name.

## Technologies Used
- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building APIs.
- **PostgreSQL**: Relational database.
- **Sequelize**: ORM for Node.js and PostgreSQL.
- **Docker**: Containerization platform.
- **Docker Compose**: Tool for defining and running multi-container Docker applications.
- **Winston**: Logging library.
  
---

## Prerequisites

To run this project, make sure you have the following installed:
- [Git](https://git-scm.com/downloads)
- [Node.js and npm](https://nodejs.org/en/download/prebuilt-installer)
- [Docker](https://docs.docker.com/get-docker/) (for containerization)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shao2005/Rise-PhoneBook.git
cd Rise-PhoneBook
```

### 2. Build and run the application

```bash
docker compose up
```
### This will:
- Build the Docker image for the Node.js app.
- Start both the app and the PostgreSQL database in containers.
- Map port 8001 on host machine to port 3000 on the container for the API and port 5434 on host machine to port 5432 on the container for PostgreSQL.

#### You will know it is running and ready to go once you see:

```bash
app  | Database connected.
app  | Executing (default): CREATE TABLE IF NOT EXISTS "Contacts" ("id"   SERIAL , "firstName" VARCHAR(255) NOT NULL, "lastName" VARCHAR(255) NOT NULL, "phone" VARCHAR(255) NOT NULL UNIQUE, "address" VARCHAR(255), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
app  | Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'Contacts' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
```

Once the application is running you can access the API at:
http://localhost:8001/contacts

---

## API Endpoints:
| Method        | Endpoint      | Description  |
| :-------------|:-------------|-----|
| GET      | `/contacts`        |Get all contacts (paginated, default 10 per page)|
| GET      | `/contacts/search` |Search contacts by first name, last name, or full name|
| POST     | `/contacts/add`    |Add a new contact|
| PUT      | `/contacts/update` |Update an existing contact|
| DELETE   | `/contacts/delete` |Delete a contact|

### 1. Get all contacts:
This is a GET request that returns paginated results (10 contacts by default). You can change the number of contacts per page by adding the query parameter "limit". You may choose the page to be shown by adding the query parameter "page" (default 1 - first page) and you can choose the order of the results by adding the order parameter.

For example: 
The request 
```bash
localhost:8001/contacts?limit=15&page=2&order=lastName
```
will return 15 contacts per page, start from page 2, and will order the contacts by their last names.

Order can receive each of the Contacts table column names (id/ firstName/ lastName/ address/ phone/ createdAt/ updatedAt), default "id".

### 2. Get contacts by name:
This is a search functionality. You can search via first name, last name or full name.

For example, assuming there is a contact called "Avi Levi" in the DB, all of the following requests will return the same contact:

```bash
localhost:8001/contacts/search?name=Avi
localhost:8001/contacts/search?name=Levi
localhost:8001/contacts/search?name=Avi Levi
localhost:8001/contacts/search?name=Levi Avi
```

### 3. Add contact:
This is a POST request, in the body of the request you must provide firstName, lastName and phone. Address is optional.

The POST request:
```bash
localhost:8001/contacts/add
```
Example body:
```JSON
{
    "firstName": "Avi",
    "lastName": "Levi",
    "phone": "054-5455455",
    "address": "Haifa"
}
```

### 4. Edit contact:
In this PUT request you must specify the User ID you want to edit in the query parameter called id, and the body of the request must specify the changes you wish to make in the contact.

For example, the PUT request:
```bash
localhost:8001/contacts/update?id=1
```
with body:
```bash
{
    "firstName": "Moshe",
    "lastName": "Cohen"
}
```
will update the name of the user with ID 1 to be Moshe Cohen.


### 5. Delete contact
To delete a contact you need to send a DELETE request that specifies the user ID you want to delete.

For example:
```bash
localhost:8001/contacts/delete?id=1
```
If it works, this endpoint returns `204` status code with no content.

---
#### Please see the bottom section of this README file and find the "Postman Collection for API Requests" section. It will make it easier for you to test this API.
---

## Running tests:
To run the test suite use the following command:
```bash
npm run runtest
``` 
This will create a separate docker compose to run the tests on, and will terminate when done.

---

## Logging:
The application uses Winston for logging. Logs are stored in the logs/app.log file in the container, and will also be displayed on the Console. The logs include timestamps, log levels (info, error, etc.), and actions taken.

---
## Postman Collection for API Requests

To make API testing easier, I included a Postman collection in this repository.

### Steps to Import the Collection:

1. Download the `postman_collection.json` file from the repository.
2. Open Postman.
3. Click on **Import** in the upper left corner of Postman.
4. Select the downloaded `postman_collection.json` file.
5. The collection will be imported, and you can now run the requests.

This will help you easily test the API endpoints provided in this project. 

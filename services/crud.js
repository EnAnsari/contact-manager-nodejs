const fs = require('fs');
const path = require('path');
const db = path.join(__dirname, '..', 'db', 'contacts.json');

function getAllContacts(callback) {
    fs.readFile(db, (err, data) => {
        if(err) {
            if(err.code === 'ENOENT')
                return callback(null, []);
                /* ENOENT stands for Error No Entity.
                In the context of Node.js file operations,
                it specifically means that the file or directory
                you're trying to access does not exist. */
            else
                return callback(err);
        }
        try {
            const contacts = JSON.parse(data);
            callback(null, contacts);
        }
        catch {
            callback(null, []);
        }
    });
}


function getContactById(id, callback) {
    getAllContacts((err, contacts) => {
        if(err)
            return callback(err);

        const contact = contacts.find(cntct => cntct.id === id);
        callback(null, contact);
    });
}


function saveInJsonFile(contacts, callback) {
    fs.writeFile(db, JSON.stringify(contacts, null, 2), callback);
}


function addContact(callback, contact) {
    getAllContacts((err, contacts) => {
        if(err)
            return callback(err);

        contacts.push(contact);
        saveInJsonFile(contacts, callback);
    });
}


function updateContact(id, updatedContact, callback) {
    getAllContacts((err, contacts) => {
        if(err)
            return callback(err);

        const index = contacts.findIndex(cntct => cntct.id === id);
        if(index === -1)
            return callback(new Error('contact not found'));

        contacts[index] = {...contacts[index], ...updatedContact};
        /* The code:
        contacts[index] = updatedContact;
        directly assigns the entire updatedContact object to the
        index position in the contacts array.
        This means that if the updatedContact object has
        fewer properties than the original contact,
        some properties will be lost. */
        saveInJsonFile(contacts, callback);
    });
}

function deleteContact(id, callback) {
    getAllContacts((err, contacts) => {
        if(err)
            return callback(err, false);

        const updatedContacts = contacts.filter(cntct => cntct.id !== id);
        if(updatedContacts.length === contacts.length)
            return callback(new Error('contact not found'));
    
        saveInJsonFile(updatedContacts, callback);
    });
}


module.exports = {
    getAllContacts,
    getContactById,
    addContact,
    updateContact,
    deleteContact
};
const fs = require('fs');
const path = require('path');

const contactsPath = path.join(__dirname, '../db/contacts.json');

class Contacts {
    constructor(id, fullname, imageUrl, mobile) {
        this.id = id;
        this.fullname = fullname;
        this.imageUrl = imageUrl;
        this.mobile = mobile;
    }

    static async getAll() {
        const data = await fs.promises.readFile(contactsPath, 'utf-8');
        const contacts = JSON.parse(data);
        return contacts;
    }

    static async getById(id) {
        const contacts = await Contacts.getAll();        
        const findedContact = contacts.find(contact => contact.id === id);
        if(!findedContact) {
            throw new Error('Contact not found')
        }
        return findedContact;
    }

    static async create(contact) {
        const contacts = await Contacts.getAll();
        const newContact = new Contacts(
            contacts.length + 1,
            contact.fullname,
            contact.imageUrl,
            contact.mobile
        );
        contacts.push(newContact);
        await fs.promises.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return newContact;
    }

    static async update(id, contact) {
        const contacts = await Contacts.getAll();
        const findedContact = contacts.find(contact => contact.id === id);
        if(!findedContact) {
            throw new Error('Contact not found');
        }
        const updatedContact = { ...findedContact, ...contact };
        const updatedContacts = contacts.map(contact => contact.id === id ? updatedContact : contact);
        await fs.promises.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
        return updatedContact;
    }

    static async delete(id) {
        const contacts = await Contacts.getAll();
        const findedContact = contacts.find(contact => contact.id === id);
        if(!findedContact) {
            throw new Error('Contact not found');
        }
        const updatedContacts = contacts.filter(contact => contact.id !== id);
        await fs.promises.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
        return findedContact;
    }
}

module.exports = Contacts;
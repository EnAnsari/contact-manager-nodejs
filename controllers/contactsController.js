const Contacts = require('../models/contact');
const busboy = require('busboy');

const createContact = async (req, res) => {
    const {fields, files} = await new Promise((resolve, reject) => {
        if(!req.headers['content-type'])
            return res.status(400).json({message: "Content-Type header is required"});
        const bb = busboy({headers: req.headers});
        const result = {fields: {}, files: []};
        bb.on('file', (fieldname, file, filename, encoding, mimetype) => {
            file.on('data', data => {
                result.files.push({fieldname, filename, data});
            });
        });
        bb.on('field', (fieldname, val) => {
            result.fields[fieldname] = val;
        });
        bb.on('finish', () => resolve(result));
        bb.on('error', error => reject(error));
        req.pipe(bb);
    });

    try {
        const contact = await Contacts.create(fields, files);
        res.status(201).json(contact);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating contact',
            detail: error.message
        });
    }

};

const getContacts = async (req, res) => {
    try {
        const contacts = await Contacts.getAll();
        res.status(200).json(contacts);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: 'Error getting contacts'});
    }
};

const getContactById = async (req, res) => {
    const {id} = req.params;
    try {
        const contact = await Contacts.getById(id);
        res.status(200).json(contact);
    }
    catch(error) {
        console.error(error);
        res.status(404).json({message: 'Contact not found'});
    }
};

const updateContact = async (req, res) => {
    const {id} = req.params;
    const {fields, files} = await new Promise((resolve, reject) => {
        if(!req.headers['content-type'])
            return res.status(400).json({message: "Content-Type header is required"});        
        const bb = busboy({headers: req.headers});
        const result = {fields: {}, files: []};
        bb.on('file', (fieldname, file, filename, encoding, mimetype) => {
            file.on('data', data => {
                result.files.push({fieldname, filename, data});
            });
        });
        bb.on('field', (fieldname, val) => {
            result.fields[fieldname] = val;
        });
        bb.on('finish', () => resolve(result));
        bb.on('error', error => reject(error));
        req.pipe(bb);
    });

    try {
        const contact = await Contacts.update(id, fields, files);
        res.status(200).json(contact);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: 'Error updating contact'});
    }
};

const deleteContact = async (req, res) => {
    const {id} = req.params;
    try {
        const contact = await Contacts.delete(id);
        res.status(200).json(contact);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: 'Error deleting contact'});
    }
};

// const getContactImage = async (req, res) => {
//     const {id} = req.params;
//     try {
//         const contact = await Contacts.getById(id);
//         res.status(200).send(contact.imageUrl);
//     }
//     catch(error) {
//         console.error(error);
//         res.status(404).json({message: 'Contact not found'});
//     }
// };

module.exports = {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact,
    // getContactImage
};
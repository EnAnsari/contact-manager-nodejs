const busboy = require('busboy');
const crudService = require('../services/crud');
const contactsController = require('../controllers/contactsController');
const { Contact } = require('../models/contact');
const { handleErrorJSON } = require('../utils/error_handler');

function createJSONResponse(res, data) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(data));
    res.end();
}

function getAllContacts(req, res, id) {
    crudService.getAllContacts((err, contacts) => {
        if(err)
            handleErrorJSON(res, 500, err.message);
        else
            createJSONResponse(res, contacts);
    });
}

function getContactById(req, res, id) {
    crudService.getContactById(id, (err, contact) => {
        if(err) {
            return handleErrorJSON(res, 500, err.message);
        }
        if(!contact)
            return handleErrorJSON(res, 404, 'contact not find')

        createJSONResponse(res, contact);
    });
}

function addContact(req, res) {
    // const bb = busboy({ headers: req.headers });
    let fields = '';
    // let fileStream = null;

    // bb.on('file', (name, file, info) => {
        // Handle file uploads (if any) here.
        // For simplicity, we'll ignore file processing in this example.
        // fileStream = file;
    // });

    req.on('data', chunk => {
        fields += chunk.toString();
    });

    req.on('end', () => {
        const {fullname, imageUrl, mobile} = JSON.parse(fields);

        if(!fullname || !mobile) // fullname and mobile is required
            return handleErrorJSON(res, 400, 'required fields missing');

        const newContact = new Contact(Date.now().toString(), fullname, imageUrl || '', mobile);
        crudService.addContact((err) => {
            if(err)
                return handleErrorJSON(res, 500, err.message);

            createJSONResponse(res, { message: 'contact added successfully'});
        }, newContact);
    });

    // req.pipe(bb);
    /* This line connects the readable stream (the request)
    to the writable stream (the busboy instance),
    allowing data to flow directly from the request to the
    busboy for parsing. */
}

function updateContact(req, res, id) {
    // const bb = busboy({ headers: req.headers });
    let fields = '';
    // let fileStream = null;

    // bb.on('file', (name, file, info) => {
        // Handle file uploads (if any) here.
        // For simplicity, we'll ignore file processing in this example.
        // fileStream = file;
    // });

    req.on('data', chunk => {
        fields += chunk.toString();
    });

    req.on('end', () => {
        // const {fullname, imageUrl, mobile} = JSON.parse(fields);
        // const updatedField = {};
        // if(fullname) updatedField.fullname = fullname;
        // if(imageUrl) updatedField.imageUrl = imageUrl;
        // if(mobile) updatedField.mobile = mobile;

        const updatedField = JSON.parse(fields);
        crudService.updateContact(id, updatedField, (err) => {
            if(err) {
                if(err.message === 'contact not found')
                    return handleErrorJSON(res, 404, err.message);
                
                return handleErrorJSON(res, 500, err.message);
            }
            createJSONResponse(res, { message: 'contact updated successfully'});
        });
    });

    // req.pipe(bb);
}

function deleteContact(req, res, id) {
    crudService.deleteContact(id, (err) => {
        if(err)
            handleErrorJSON(res, 500, err.message);
        else
            createJSONResponse(res, {message: 'contact deleted successfully!'})
    });
}

module.exports = {
    getAllContacts,
    getContactById,
    addContact,
    updateContact,
    deleteContact
};

// const createContact = async (req, res) => {
//     const {fields, files} = await new Promise((resolve, reject) => {
//         if(!req.headers['content-type'])
//             return res.status(400).json({message: "Content-Type header is required"});
//         const bb = busboy({headers: req.headers});
//         const result = {fields: {}, files: []};
//         bb.on('file', (fieldname, file, filename, encoding, mimetype) => {
//             file.on('data', data => {
//                 result.files.push({fieldname, filename, data});
//             });
//         });
//         bb.on('field', (fieldname, val) => {
//             result.fields[fieldname] = val;
//         });
//         bb.on('finish', () => resolve(result));
//         bb.on('error', error => reject(error));
//         req.pipe(bb);
//     });

//     try {
//         const contact = await Contacts.create(fields, files);
//         res.status(201).json(contact);
//     }
//     catch(error) {
//         console.error(error);
//         res.status(500).json({
//             message: 'Error creating contact',
//             detail: error.message
//         });
//     }

// };

// };


// const updateContact = async (req, res) => {
//     const {id} = req.params;
//     const {fields, files} = await new Promise((resolve, reject) => {
//         if(!req.headers['content-type'])
//             return res.status(400).json({message: "Content-Type header is required"});        
//         const bb = busboy({headers: req.headers});
//         const result = {fields: {}, files: []};
//         bb.on('file', (fieldname, file, filename, encoding, mimetype) => {
//             file.on('data', data => {
//                 result.files.push({fieldname, filename, data});
//             });
//         });
//         bb.on('field', (fieldname, val) => {
//             result.fields[fieldname] = val;
//         });
//         bb.on('finish', () => resolve(result));
//         bb.on('error', error => reject(error));
//         req.pipe(bb);
//     });

//     try {
//         const contact = await Contacts.update(id, fields, files);
//         res.status(200).json(contact);
//     }
//     catch(error) {
//         console.error(error);
//         res.status(500).json({message: 'Error updating contact'});
//     }
// };

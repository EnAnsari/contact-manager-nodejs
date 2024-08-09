const url = require('url');
const errorHandler = require('../utils/error_handler');
const contactsController = require('../controllers/contactsController');

function handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    pathname = parsedUrl.pathname;
    method = req.method;
    const idMatch = pathname.match(/^\/contacts\/(\d+)$/);
    const id = idMatch && !isNaN(parseInt(idMatch[1])) ? idMatch[1] : null;

    if(id) {
        switch(method) {
            case 'GET':
                contactsController.getContactById(req, res, id);
                break;    
            case 'PUT':
                contactsController.updateContact(req, res, id);
                break;
            case 'DELETE':
                contactsController.deleteContact(req, res, id);
                break;
            default:
                errorHandler.handleErrorJSON(res, 404, 'url not found!');
        }
    }
    else {
        switch(method) {
            case 'GET':
                contactsController.getAllContacts(req, res);
                break;
            case 'POST':
                contactsController.addContact(req, res);
                break;
            default:
                console.log('hey, i am here');
                errorHandler.handleErrorJSON(res, 404, 'url not found!');
        }
    }
}

module.exports = {
    handleRequest
};
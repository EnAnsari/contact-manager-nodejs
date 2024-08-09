const url = require('url');
const contacts = require('./contacts');
const errorHandler = require('../utils/error_handler');

function handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    pathname = parsedUrl.pathname;

    if(pathname.startsWith('/contacts')) {
        contacts.handleRequest(req, res);
    }
    else {
        errorHandler.handle404(res);
    }
}

module.exports = {
    handleRequest
};
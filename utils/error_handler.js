const fs = require('fs');
const path = require('path');

function handle404(res) {
    fs.readFile(path.join(__dirname, '../public', '404.html'), (err, data) => {
        if (err) {
            // Handle error reading 404 page
            console.error('Error reading 404 page:', err);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.write('Internal Server Error');
            res.end();
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        }
    });
}

function handleErrorJSON(res, statusCode, err) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ error: err }));
    res.end();
}

module.exports = {
    handle404,
    handleErrorJSON
};

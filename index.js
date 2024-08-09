const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const routes = require('./routes/routes');
const errorHandler = require('./utils/error_handler');

const PORT = 8080;

const connection = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if(pathname.startsWith('/public')) {
        const filePath = path.join(__dirname, pathname);
        fs.readFile(filePath, (error, data) => {
            if(error) {
                errorHandler.handle404(res);
            }
            else {
                res.writeHead(200);
                res.write(data);
                res.end();
            }
        });
    }
    else {
        routes.handleRequest(req, res);
    }
};

const server = http.createServer(connection);

server.listen(PORT, () => {
    console.log(`sever started on port ${PORT}`);
});
var http = require('http');

let server = http.createServer();

server.listen(40001)
    .on('request', (req, res) => {
        if ((req.method === 'POST' || req.method === 'GET') && (req.url === '/' || req.url === '/A' || req.url === '/A/B')) {
            res.writeHead(200, { 'Content-Type': 'text/plain;chatset=utf-8' });
            res.end(`${req.method}:${req.url}`);
        } else {
            res.statusCode = 404;
            res.end('Not found');
        }

    });
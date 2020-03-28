var http = require('http');
var url = require('url');

let server = http.createServer();

server.listen(40001)
    .on('request', (req, res) => {
        let p = url.parse(req.url, true);
        if (req.method === "POST" && p.pathname === '/') {
            res.writeHead(200, { 'Content-Type': 'text/html;chatset=utf-8' });
            let result = "";
            req.on('data', data => { result += data });
            req.on('end', () => {
                res.end(`SERVER:${JSON.stringify(result)}`);
            })
        } else {
            res.statusCode = 404;
            res.end("Not found");
        }
    });
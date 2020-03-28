var http = require('http');
var url = require('url');
let server = http.createServer();


server.listen(40001)
    .on('request', (req, res) => {
        let p = url.parse(req.url, true);
        if (req.method === "POST" && p.pathname === '/') {
            if (req.headers['content-type'] == 'application/xml') {
                let xmltext = "";
                req.on('data', data => {
                    xmltext += data;
                });
                req.on('end', () => {
                    res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
                    res.end(`<SERVER>${xmltext}</SERVER>`);
                });
            } else {
                res.end('Error content-type');
            }
        } else {
            res.statusCode = 404;
            res.end("Not found");
        }
    });
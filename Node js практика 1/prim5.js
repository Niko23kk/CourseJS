var http = require('http');
var url = require('url');

let server = http.createServer();

server.listen(40001)
    .on('request', (req, res) => {
        let p = url.parse(req.url, true);
        if (req.method === "POST" && p.pathname === '/') {
            if (req.headers['content-type'] == 'application/xml') {
                res.writeHead(200, { 'Content-Type': 'text/html;chatset=utf-8' });
                let result = "";
                req.on('data', data => { result += data });
                req.on('end', () => {
                    try {
                        let obj = JSON.parse(result);
                        res.end(`SERVER:${JSON.stringify(obj)}`);
                    } catch {
                        res.end("JSON file is not correct");
                    }
                })
            } else {
                res.end("Error content-type");
            }
        } else {
            res.statusCode = 404;
            res.end("Not found");
        }
    });
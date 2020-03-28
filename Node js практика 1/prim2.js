var http = require('http');
var url = require('url');

let server = http.createServer();

server.listen(40001, () => { console.log('Server listen 40001') })
    .on('request', (req, res) => {
        if (req.method != 'GET') {
            res.statusCode = 404;
            res.end('Not found');
            return;
        }

        let p = url.parse(req.url, true);
        let q = url.parse(req.url, true).query;

        res.writeHead(200, { 'Content-Type': 'text/plain;chatset=utf-8' });
        switch (p.pathname) {
            case '/SUM':
                {
                    if (typeof q.x !== "undefined" && typeof q.y !== "undefined") {
                        res.end(`${Number(q.x)}+${Number(q.y)}=${Number(q.x)+Number(q.y)}`);
                    } else {
                        res.end('Error in the parameters');
                    }
                    break;
                }
            case '/SUB':
                {
                    if (typeof q.x !== "undefined" && typeof q.y !== "undefined") {
                        res.end(`${Number(q.x)}-${Number(q.y)}=${Number(q.x)-Number(q.y)}`);
                    } else {
                        res.end('Error in the parameters');
                    }
                    break;
                }
            case '/CONC':
                {
                    if (typeof q.x !== "undefined" && typeof q.y !== "undefined") {
                        res.end(`${q.x}+${q.y}=${q.x+q.y}`);
                    } else {
                        res.end('Error in the parameters');
                    }
                    break;
                }
            default:
                {
                    res.end('Error in the method');
                    return;
                }
        }
    });
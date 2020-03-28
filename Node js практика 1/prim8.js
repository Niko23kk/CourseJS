var http = require('http');
var url = require('url');
var fs = require('fs');

let server = http.createServer();

server.listen(40001, () => { console.log('Server listen 40001') })
    .on('request', (req, res) => {
        let q = url.parse(req.url, true).query;
        let p = url.parse(req.url, true);
        let fileName = p.pathname.substring(p.pathname.lastIndexOf("/") + 1);
        console.log(fileName);
        let path = __dirname + "/directory/" + fileName;
        if (req.method === "GET" && p.pathname.includes("/download/")) {
            res.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
            res.writeHead(200, { "Content-Disposition": "attachment;filename=" + fileName });
            fs.createReadStream(path).pipe(res);
            res.end();
        } else {
            res.statusCode = 404;
            res.end("Not found");
        }
    });
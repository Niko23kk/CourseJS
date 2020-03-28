var http = require('http');
let url = require('url');
let fs = require('fs')

let server = http.createServer();

server.listen(40001)
    .on('request', (req, res) => {
        let p = url.parse(req.url, true);
        if (p.pathname === "/") {
            res.writeHead(200, { 'Content-Type': 'text/html;chatset=utf-8' });
            res.end(fs.readFileSync(__dirname + '/Static/index.html'));
        } else if (isStatic("css", req.url)) {
            sendFile(req, res, { "Content-type": "text/css;charset=utf-8" });
            res.writeHead(200, { 'Content-Type': 'text/css;chatset=utf-8' });
            res.end(fs.readFileSync(pathStatic(req.url)));
        } else if (isStatic("js", req.url)) {
            sendFile(req, res, { "Content-type": "text/javascript;charset=utf-8" });
            res.writeHead(200, { 'Content-Type': 'text/js;chatset=utf-8' });
            res.end(fs.readFileSync(pathStatic(req.url)));
        } else {
            res.statusCode = 404;
            res.end("Not found");
        }
    });


let pathStatic = (fn) => { return `./Static${fn}`; }

let writeHTTP404 = (res) => {
    res.statusCode = 404;
    res.statusMessage = "Resource not found";
    res.end("Resourse not found");
}

let pipeFile = (req, res, headers) => {
    res.writeHead(200, headers);
    fs.createReadStream(pathStatic(req.url)).pipe(res);
}
let isStatic = (ext, fn) => {
    let reg = new RegExp(`^\/.+\.${ext}$`);
    return reg.test(fn);
}
let sendFile = (req, res, headers) => {
    console.log(pathStatic(req.url));
    fs.access(pathStatic(req.url), fs.constants.R_OK, err => {
        if (err) writeHTTP404(res);
        else pipeFile(req, res, headers);
    })
}

module.exports = param => { return new Stat(parm); }
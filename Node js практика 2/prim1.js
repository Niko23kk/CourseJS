const http = require('http');
let fs = require('fs');

const httpServer = http.createServer();
httpServer.listen(3000)
    .on('request', (req, res) => {
        if (req.method === "GET" && req.url === "/") {
            res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
            res.end(fs.readFileSync("./Static/prim1.html"));
        } else {
            res.statusCode = 404;
            res.end("Not found");
        }
    });

let k = 0;
let log = process.stdout;
const WebSocket = require('ws');
const wsServer = new WebSocket.Server({ port: 4000, host: "localhost", path: "/" });
wsServer.on("connection", ws => {
    ws.on("message", message => {
        log.write(message);
    })
    setInterval(() => { ws.send(`Server: ${++k}`) }, 3000);
    ws.on("error", e => { console.log("Error", e) });
})
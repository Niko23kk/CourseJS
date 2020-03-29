const http = require('http');
let fs = require('fs');

const httpServer = http.createServer();
httpServer.listen(3000)
    .on('request', (req, res) => {
        if (req.method === "GET" && req.url === "/") {
            res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
            res.end(fs.readFileSync("./Static/prim2.html"));
        } else {
            res.statusCode = 404;
            res.end("Not found");
        }
    });

const WebSocket = require('ws');
const wsServer = new WebSocket.Server({ port: 4000, host: "localhost", path: "/" });
wsServer.on("connection", ws => {
    const duplex = WebSocket.createWebSocketStream(ws, { encoding: "utf-8" });
    duplex.pipe(process.stdout);
    let uf = fs.createReadStream(`./Static/file.txt`);
    uf.pipe(duplex);

    ws.on("pong", (data) => {
        if (data.toString() === "a") {}
    })

    ws.on("message", message => {
        let reg = RegExp("id-\\d{1,3}");
        if (reg.test(message)) {
            console.log(`Server connect: ${message}`);
            return;
        }
        wsServer.clients.forEach(element => {
            element.send(message.toString());
        });
    })

    setInterval(() => {
        wsServer.clients.forEach(element => {
            element.ping("a");
        });
        let count = 0;
        wsServer.clients.forEach(element => {
            count++;
        });
        ws.send(`out count:${count}`)
    }, 5000);

    ws.on("error", e => { log.write("Error", e) });
})
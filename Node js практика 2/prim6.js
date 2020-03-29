const WebSocket = require('ws');
const fs = require('fs');

const HOST = 'localhost';
const wsServer = new WebSocket.Server({ port: 4000, host: HOST });
let log = process.stdout;

wsServer.on('connection', (ws) => {
        const duplex = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });
        let uf = fs.createReadStream(`./Static/file.txt`);
        process.stdin.pipe(duplex);
        uf.pipe(duplex);
    })
    .on('error', (e) => { log.write('WS server error\n', e); });
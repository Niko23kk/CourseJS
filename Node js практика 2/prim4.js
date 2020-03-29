const WebSocket = require('ws');

const HOST = 'localhost';
const wsserv = new WebSocket.Server({ port: 4000, host: HOST, path: "/" });
let log = process.stdout;

wsserv.on('connection', (ws) => {
        ws.on('message', message => {
            let data = JSON.parse(message);
            if (data) {
                log.write(`x:${data.x}, y:${data.y}\n`);
                ws.send(JSON.stringify({ x: data.x, y: data.y, z: data.x + data.y }));
            }
        });
    })
    .on('error', (e) => { log.write('Error: ', e); });
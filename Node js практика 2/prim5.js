const WebSocket = require('ws');
const fs = require('fs');

const HOST = 'localhost';
const wsServer = new WebSocket.Server({ port: 4000, host: HOST });
let log = process.stdout;
let k = 1;

wsServer.on('connection', (ws) => {
        k = 1;
        const duplex = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });

        fs.readdir('./Static/', (err, files) => {
            files.forEach(file => {
                let reg = new RegExp('^(.*?).txt', "gmi");
                if (reg.test(file)) {
                    if (Number.isInteger(Number(file.substring(0, file.indexOf(".") - 1))))
                        k++;
                }
            })
            let f = fs.createWriteStream(`./Static/${k}.txt`);
            duplex.pipe(f);
        });
    })
    .on('error', (e) => { log.write('WS server error\n', e); });
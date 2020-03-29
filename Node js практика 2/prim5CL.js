const WebSocket = require('ws');
const fs = require('fs');

let socket = new WebSocket('ws:/localhost:4000/');
let log = process.stdout;

socket.onopen = () => {
    const duplex = WebSocket.createWebSocketStream(socket, { encoding: 'utf8' });
    let uf = fs.createReadStream(`./Static/file.txt`);
    process.stdin.pipe(duplex);
    uf.pipe(duplex);
};
socket.onclose = () => { log.write(`Socket closed\n`); };
socket.onerror = (e) => { log.write(`Error: ${e.message}\n`); };
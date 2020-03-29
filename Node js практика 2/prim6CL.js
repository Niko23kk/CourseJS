const WebSocket = require('ws');
const fs = require('fs');

let socket = new WebSocket('ws:/localhost:4000/');
let log = process.stdout;

socket.onopen = () => {
    let k = 1;
    const duplex = WebSocket.createWebSocketStream(socket, { encoding: 'utf8' });

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
};
socket.onclose = () => { log.write(`Socket closed\n`); };
socket.onerror = (e) => { log.write(`Error: ${e.message}\n`); };
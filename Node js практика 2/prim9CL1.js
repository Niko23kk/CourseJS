const rpc = require('rpc-websockets').Client;
let log = process.stdout;

const ws = new rpc('ws://localhost:4000/');
ws.on('open', () => {
    let timer = setInterval(() => {
        ws.notify("N2");
    }, 500);
    setTimeout(() => {
        clearInterval(timer);
    }, 10000);
});
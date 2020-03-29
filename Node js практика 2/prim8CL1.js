const rpc = require('rpc-websockets').Client;
let log = process.stdout;

const ws = new rpc('ws://localhost:4000/');
ws.on('open', () => {
    ws.subscribe('CCC');
    ws.on('CCC', () => log.write('CCC event\n'));
});
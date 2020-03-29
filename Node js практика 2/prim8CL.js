const rpc = require('rpc-websockets').Client;
let log = process.stdout;

const ws = new rpc('ws://localhost:4000/');
ws.on('open', () => {
    ws.subscribe('AAA');
    ws.subscribe('BBB');
    ws.on('AAA', () => log.write('AAA event\n'));
    ws.on('BBB', () => log.write('BBB event\n'));
});
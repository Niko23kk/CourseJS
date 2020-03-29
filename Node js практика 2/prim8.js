const RPC = require('rpc-websockets').Server;

const ws = new RPC({ port: 4000, host: "localhost", path: "/" });

ws.event('AAA');
ws.event('BBB');
ws.event('CCC');

let input = process.stdin;
input.setEncoding('utf-8');
input.on('data', data => {
    if (data.length == 5) {
        data = data.slice(0, 3);
        ws.emit(data);
    }
});
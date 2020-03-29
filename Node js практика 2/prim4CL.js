const WebSocket = require('ws');

let socket = new WebSocket('ws:/localhost:4000');

let log = process.stdout;
let timer;
let a = 0;
let b = 50;

socket.onopen = () => {
    timer = setInterval(() => {
        socket.send(JSON.stringify({ x: ++a, y: b = b - 2 }))
    }, 500);
    setTimeout(() => socket.close(), 20000);
}
socket.onmessage = (e) => { log.write(`message: ${e.data}\n`); };
socket.onerror = (e) => { log.write(`Error: ${e.message}\n`); };
const WebSocket = require('ws');

let param = process.argv[2];
typeof param === "undefined" ? "A" : param;

ws = new WebSocket("ws:/localhost:4000/");

ws.onopen = () => {
    ws.send(`id-${param}`);
}

ws.onmessage = data => {
    let reg = new RegExp("^out");
    if (!reg.test(data.data)) {
        console.log(`Server ${param} get: ${data.data}`);
    }
}
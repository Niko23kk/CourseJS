const RPC = require('rpc-websockets').Server;

const ws = new RPC({ port: 4000, host: "localhost", path: "/" });

let out = process.stdout;

ws.register("N1", () => out.write("N1\n")).public();
ws.register("N2", () => out.write("N2\n")).public();
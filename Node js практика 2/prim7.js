const RPCsoc = require('rpc-websockets').Server;

const wsRPC = new RPCsoc({ port: 4000, host: "localhost" });


wsRPC.setAuth(credentials => credentials.login === 'admin' && credentials.password === 'admin');
wsRPC.register('sum', params => {
    if (params.length < 3) {
        let a = Number(params[0]);
        let b = Number(params[1]);
        if (a && b) { return a + b } else { return 'invalid param' }
    } else {
        return;
    }
}).public();

wsRPC.register('mul', params => {
    let res = 1;
    params.forEach(element => {
        res *= element;
    });
    if (params.length > 0) { return res } else { return 'invalid param' }
}).public();

wsRPC.register('conc', params => {
    if (params.length < 4) {
        let a = params[0];
        let b = params[1];
        let c = params[2];
        if (a && b && c) { return a + b + c } else { return 'invalid param' }
    } else { return }
}).protected();
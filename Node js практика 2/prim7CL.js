const rpc = require('rpc-websockets').Client;
let log = process.stdout;

const wsrpc = new rpc('ws:/localhost:4000');
wsrpc.on('open', () => {
    wsrpc.call('sum', [5, 8])
        .then(answer => log.write(`sum: ${answer}\n`))
        .catch(() => { log.write(`ERROR\n`) });

    wsrpc.call('mul', [5, 5, 11, 2, 2, 2])
        .then(answer => log.write(`mul: ${answer}\n`))
        .catch(() => { log.write(`ERROR\n`) });

    wsrpc.login({ login: 'admin', password: 'admin' })
        .then(login => {
            if (login) {
                wsrpc.call('conc', ['Hello', ', ', 'world'])
                    .then(answer => log.write(`conc: ${answer}\n`));
            } else {
                log.write('Access denied');
            }
        })
        .catch(() => { log.write(`ERROR\n`) });
});
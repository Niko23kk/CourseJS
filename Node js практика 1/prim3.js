var http = require('http');
var url = require('url');
const { parse } = require('querystring');

let server = http.createServer();

server.listen(40001)
    .on('request', (req, res) => {
        if (req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'text/html;chatset=utf-8' });
            res.end(`<form id="form" method="post" action="/">
            <input name="x" id="x" type="text" placeholder="x" value=""/>
            <input name="y" id="y" type="text" placeholder="y" value=""/></br>
            <input type="submit" name="BUT" value="SUM"/></br>
            <input type="submit" name="BUT" value="SUB"/></br>
            <input type="submit" name="BUT" value="CONC"/></br>
            <input type="submit" name="BUT" value="CANCEL"/></br>
            </form>
            `)
        } else if (req.method === 'POST') {
            let q = url.parse(req.url, true).query;
            let butt;
            let x;
            let y;
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on("end", () => {
                let buf = parse(body);
                x = buf.x;
                y = buf.y;
                butt = buf.BUT;
                switch (`${butt}`) {
                    case 'SUM':
                        {
                            if (x != undefined && y != undefined) {
                                res.end(`${Number(x)}+${Number(y)}=${Number(x)+Number(y)}`);
                            } else {
                                res.end('Error in the parameters');
                            }
                            break;
                        }
                    case 'SUB':
                        {
                            if (x != undefined && y != undefined) {
                                res.end(`${Number(x)}-${Number(y)}=${Number(x)-Number(y)}`);
                            } else {
                                res.end('Error in the parameters');
                            }
                            break;
                        }
                    case 'CONC':
                        {
                            if (x != undefined && y != undefined) {
                                res.end(`${x}+${y}=${x+y}`);
                            } else {
                                res.end('Error in the parameters');
                            }
                            break;
                        }
                    case 'CANCEL':
                        {
                            res.end('CANCEL');
                        }
                    default:
                        {
                            res.end('Error in the method');
                            return;
                        }
                }
            });
        } else {
            res.statusCode = 404;
            res.end('Not found');
        }

    });
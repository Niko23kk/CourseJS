var multiparty = require('multiparty');
var http = require('http');
var util = require('util');
var url = require('url');


http.createServer(function(req, res) {
    if (req.method === 'POST') {
        let p = url.parse(req.url, true);
        if (p.query.butt === "SEND") {
            var form = new multiparty.Form({ uploadDir: __dirname + "/directory" });

            form.parse(req, function(err, fields, files) {
                res.writeHead(200, { 'Content-Type': 'text/plain;chatset=utf-8' });
                res.end("File received");
            })
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain;chatset=utf-8' });
            res.end("CLOSE");
        }
    } else if (req.url === '/' && req.method === 'GET') {
        // show a file upload form
        res.writeHead(200, { 'content-type': 'text/html' });
        res.end(`
        <form id="form" enctype="multipart/form-data">
            <input type="file" name="file">
            <br>
            <input type="button" onclick="sendForm(this)" value="SEND">
            <input type="button" onclick="sendForm(this)" value="CANCEL">
        </form>
        <script>
            function sendForm(butt){
                let form = document.getElementById('form');
                form.method = 'post';
                form.action = '/upload?butt=' + butt.value;
                form.submit();
            }
        </script>
    `);
    } else {
        res.statusCode = 404;
        res.end("Not found");
    }
}).listen(40001);
const http = require('http');
let fs = require('fs');

const httpServer = http.createServer();
httpServer.listen(3000)
    .on('request', (req, res) => {
        let regN = new RegExp("/\\d", "gmi");
        let regDate = new RegExp("/backup/\\d");

        if (req.method === "GET" && req.url === "/") {

            res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
            let obj = JSON.parse(fs.readFileSync("./json/StudentList.json"));
            res.end(`${JSON.stringify(obj)}`);

        } else if (req.method === "GET" && regN.test(req.url)) {

            let id = req.url.substring(1, req.url.lenght);
            let find;
            res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
            let obj = JSON.parse(fs.readFileSync("./json/StudentList.json"));

            obj.forEach(element => {
                if (element["id"] === Number(id)) {
                    find = element;
                }
            });

            if (typeof find !== "undefined") {
                res.end(`${JSON.stringify(find)}`);
            } else {
                res.end(JSON.stringify(`Студент с id равным ${id} не найден`));
            }

        } else if (req.method === "GET" && req.url === "/backup") {
            let list = [];
            fs.readdir("./json/", (err, files) => {
                files.forEach(file => {
                    if (file.includes("_StudentList")) {
                        list.push(file);
                    }
                })
                res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
                res.end(JSON.stringify(list));
            })
        } else if (req.method === "POST" && req.url === "/") {

            let obj = JSON.parse(fs.readFileSync("./json/StudentList.json"));
            let body = '';
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

            req.on('data', data => {
                body = data.toString();
                body = JSON.parse(body);
            });

            req.on('end', async() => {
                if (obj.find(s => s.id == body.id)) {
                    res.end(JSON.stringify(`Студент с id равным ${body.id} уже есть`));
                } else {
                    let student = { id: body.id, name: body.name, bday: body.bday, specility: body.specility };
                    obj.push(student);
                    fs.writeFile("./json/StudentList.json", JSON.stringify(obj), () => {});
                    res.end(JSON.stringify(student));
                }
            });

        } else if (req.method === "PUT" && req.url === "/") {

            let obj = JSON.parse(fs.readFileSync("./json/StudentList.json"));
            let body = '';
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

            req.on('data', data => {
                body = data.toString();
                body = JSON.parse(body);
            });

            req.on('end', async() => {
                let oldstudnet = obj.find(s => s.id == body.id);
                if (typeof oldstudnet !== "undefined") {
                    let student = { id: body.id, name: body.name, bday: body.bday, specility: body.specility };
                    Object.keys(oldstudnet).forEach(s => {
                        if (student[s] !== oldstudnet[s]) {
                            oldstudnet[s] = student[s];
                        }
                    })
                    fs.writeFile("./json/StudentList.json", JSON.stringify(obj), () => {});
                    res.end(JSON.stringify(oldstudnet));
                } else {
                    res.end(JSON.stringify(`Студент с id равным ${body.id} не найден`));
                }
            });

        } else if (req.method === "DELETE" && regN.test(req.url)) {

            let id = req.url.substring(1, req.url.lenght);
            res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
            let obj = JSON.parse(fs.readFileSync("./json/StudentList.json"));

            let del = obj.find(s => s.id == id);
            if (typeof del !== "undefined") {
                obj.splice(obj.findIndex(s => s === del), 1);
                fs.writeFile("./json/StudentList.json", JSON.stringify(obj), () => {});
                res.end(`${JSON.stringify(del)}`);
            } else {
                res.end(JSON.stringify(`Студент с id равным ${id} не найден`));
            }

        } else if (req.method === "POST" && req.url === "/backup") {
            setTimeout(() => {

                let Data = new Date();
                let year = Data.getFullYear();
                let month = Data.getMonth() + 1;

                if (month.toString().length === 1) {
                    month = "0" + month;
                }

                let day = Data.getDate();
                let hour = Data.getHours();
                let minutes = Data.getMinutes();
                let seconds = Data.getSeconds();
                let data = `${year}${month}${day}${hour}${minutes}${seconds}`;

                fs.createReadStream("./json/StudentList.json").pipe(fs.createWriteStream(`./json/${data}_StudentList.json`));
                res.end("Файл скопирован");

            }, 2000);

        } else if (req.method === "DELETE" && regDate.test(req.url)) {

            let year = req.url.toString().substring(8, 12);
            let day = req.url.substring(12, 14);
            let month = req.url.substring(14, 16);

            fs.readdir('./json/', (err, files) => {
                files.forEach(file => {
                    let reg = new RegExp("\\d{14}_StudentList.json")
                    if (reg.test(file)) {
                        let fileDate = file.substring(0, 8);
                        let date = new Date(`${year}-${month}-${day}`);
                        let fileDate1 = new Date(`${fileDate.substring(0,4)}-${fileDate.substring(4,6)}-${fileDate.substring(6,8)}`);
                        if (fileDate1 < date) {
                            fs.unlink(file, function(err) {
                                if (err) throw err;
                            });
                        }
                    }
                })
                res.end();
            });

        } else {
            res.statusCode = 404;
            res.end("Not found");
        }
    });

let ws = require('ws');
const wsServer = new ws.Server({ port: 4000, host: "localhost", path: "/" });

wsServer.on("connection", (ws) => {
    console.log("Connet with WS");
})
let b = false;
fs.watch(`${__dirname}/json`, (event, fname) => {
    if (fname) {
        if (event == 'change') {
            if (b === false) {
                sendBroad(fname, event);
                b = true;
            } else {
                b = false;
            }

        }
    }
});

function sendBroad(fname, event) {
    wsServer.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
            client.send(fname + ' ' + event);
        }
    });
}
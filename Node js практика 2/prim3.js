const WebSocket = require('ws');
let fs = require('fs');

ws = new WebSocket("ws:/localhost:4000/");

const duplex = WebSocket.createWebSocketStream(ws, { encoding: "utf-8" });

duplex.pipe(process.stdout);

process.stdin.pipe(duplex);

let f = fs.createReadStream(`./Static/file.txt`);
f.pipe(duplex);
//создаем поток duplex , который совмещает в себе 2 других потока (на чтение и записаь)
//указываем для duplex стандартные потоки которые он должен использовать для передачи
//для тестирования создаем переменную f, в которой содержится поток считывающий файл
//и передаем его серверу. На сервере в свою очередь так же создаем duplex
//повторяем то что уже сделали на клиенте, принимаем и отдаем данные
//на клиент информация приходит 2 раза так как он принимает и сообщение от сервера
//и от самого себя
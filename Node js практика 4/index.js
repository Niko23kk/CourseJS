const sql = require("mssql");
const fs = require("fs");
let url = require("url");
const http = require("http");

let config = {
    password: "12345",
    host: "localhost",
    server: "ASUS-ROG",
    user: "Node",
    port: 1433,
    database: "NAO"
};

let usedb = `use ${config.database}`;
const httpServer = http.createServer();
connectionPool = new sql.ConnectionPool(config).connect();

sql.connect(config, err => {
    if (err) console.log("Ошибка соединения с БД:", err.code);
    else {
        console.log("Соединение с БД установленно");
    }
})

function get(table) {
    return connectionPool.then(pool => {
        return pool.query(`${usedb} SELECT * FROM ${table}`);
    });
}

function insert(table, fields) {
    return connectionPool.then(pool => {
        let request = pool.request();
        let query = `${usedb} INSERT INTO ${table} values (`;
        Object.keys(fields).forEach(field => {
            let fieldType = Number.isInteger(fields[field]) ? sql.Int : sql.NVarChar;
            request.input(field, fieldType, fields[field]);
            query += `@${field},`;
        });
        query = query.replace(/,$/, ")");
        return request.query(query);
    });
}

function update(table, fields) {
    return connectionPool.then(pool => {
        let query = `${usedb} UPDATE ${table} SET `;
        let value;
        Object.keys(fields).forEach(field => {
            if (field.toLowerCase() != table.toLowerCase()) {
                query += `${field} = '${fields[field]}',`;
            } else value = fields[field];
        });
        query = query.replace(/,$/, "");
        query += ` WHERE ${table} = '${value}'`;
        return pool.request().query(query);
    });
}

function getOne(table, value) {
    return connectionPool.then(pool => {
        return pool.query(`${usedb} SELECT * FROM ${table} WHERE ${table} = '${value}'`);
    });
}

function del(table, value) {
    return connectionPool.then(pool => {
        return pool.query(`${usedb} DELETE FROM ${table} WHERE ${table} = '${value}'`);
    });
}



httpServer.listen(3000)
    .on("request", (req, res) => {

        let tableArray = ["faculty", "pulpit", "subject", "auditorium_type", "auditorium"];

        if (req.method === "GET" && req.url === "/") {

            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(fs.readFileSync("./index.html"));

        } else if ((req.method === "GET") && (req.url === "/api/faculties" || req.url === "/api/pulpits" || req.url === "/api/subjects" ||
                req.url === "/api/auditoriumstypes" || req.url === "/api/auditoriums" || req.url === "/api/auditoriums")) {

            let urltable = req.url.substring(req.url.lastIndexOf("/") + 1, req.url.lenght);
            let table;
            switch (urltable) {
                case "faculties":
                    table = tableArray[0];
                    break;
                case "pulpits":
                    table = tableArray[1];
                    break;
                case "subjects":
                    table = tableArray[2];
                    break;
                case "auditoriumstypes":
                    table = tableArray[3];
                    break;
                case "auditoriums":
                    table = tableArray[4];
                    break;
            }
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });

            get(table)
                .then(result => {
                    res.end(JSON.stringify(result.recordset));
                })
                .catch(error => {
                    res.statusCode = 400;
                    res.end(JSON.stringify(`error: ${String(error)} `));
                });

        } else if (req.method === "POST" && (req.url === "/api/faculties" || req.url === "/api/pulpits" || req.url === "/api/subjects" ||
                req.url === "/api/auditoriumstypes" || req.url === "/api/auditoriums" || req.url === "/api/auditoriums")) {

            let urltable = req.url.substring(req.url.lastIndexOf("/") + 1, req.url.lenght);
            let table;
            let body;
            switch (urltable) {
                case "faculties":
                    table = tableArray[0];
                    break;
                case "pulpits":
                    table = tableArray[1];
                    break;
                case "subjects":
                    table = tableArray[2];
                    break;
                case "auditoriumstypes":
                    table = tableArray[3];
                    break;
                case "auditoriums":
                    table = tableArray[4];
                    break;
            }
            req.on("data", data => {
                body = data.toString();
                body = JSON.parse(data);
            });
            req.on("end", () => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                insert(table, body)
                    .then(result => {
                        res.end(JSON.stringify(body));
                    })
                    .catch(error => {
                        res.statusCode = 400;
                        res.end(JSON.stringify(`error: ${String(error)} `));
                    });
            });

        } else if (req.method === "PUT" && (req.url === "/api/faculties" || req.url === "/api/pulpits" || req.url === "/api/subjects" ||
                req.url === "/api/auditoriumstypes" || req.url === "/api/auditoriums" || req.url === "/api/auditoriums")) {

            let urltable = req.url.substring(req.url.lastIndexOf("/") + 1, req.url.lenght);
            let table;
            let body;
            switch (urltable) {
                case "faculties":
                    table = tableArray[0];
                    break;
                case "pulpits":
                    table = tableArray[1];
                    break;
                case "subjects":
                    table = tableArray[2];
                    break;
                case "auditoriumstypes":
                    table = tableArray[3];
                    break;
                case "auditoriums":
                    table = tableArray[4];
                    break;
            }
            req.on("data", data => {
                body = data.toString();
                body = JSON.parse(data);
            });
            req.on("end", () => {
                res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
                update(table, body)
                    .then(result => {
                        res.end(JSON.stringify(body));
                    })
                    .catch(error => {
                        res.statusCode = 400;
                        res.end(JSON.stringify(`error: ${String(error)} `));
                    });
            });

        } else if (req.method === "DELETE" && (req.url.indexOf("/api/faculties/") !== -1 || req.url.indexOf("/api/pulpits/") !== -1 ||
                req.url.indexOf("/api/subjects/") !== -1 || req.url.indexOf("/api/auditoriumstypes/") !== -1 || req.url.indexOf("/api/auditoriums/") !== -1)) {

            let urltable = req.url.substring(req.url.indexOf("api/") + 4, req.url.lastIndexOf("/"));
            let value = req.url.substring(req.url.lastIndexOf("/") + 1, req.url.lenght);
            value = decodeURI(value);
            let table;
            let count = 0;
            req.url.split("/").forEach(el => {
                if (el !== "")
                    count++;
            });

            if (count === 3) {
                switch (urltable) {
                    case "faculties":
                        table = tableArray[0];
                        break;
                    case "pulpits":
                        table = tableArray[1];
                        break;
                    case "subjects":
                        table = tableArray[2];
                        break;
                    case "auditoriumstypes":
                        table = tableArray[3];
                        break;
                    case "auditoriums":
                        table = tableArray[4];
                        break;
                }
                res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
                getOne(table, value)
                    .then(result => {
                        if (Number(result.rowsAffected) !== 0) {
                            res.end(JSON.stringify(result.recordset));
                            del(table, value)
                                .then(result => {})
                                .catch(error => {
                                    res.statusCode = 400;
                                    res.end(JSON.stringify(`error: ${String(error)} `));
                                });
                        } else res.end(JSON.stringify(`error: Error value`));
                    })
                    .catch(error => {
                        res.statusCode = 400;
                        res.end(JSON.stringify(`error: ${String(error)} `));
                    });
            }
        } else {
            res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify("Not found"));
        }
    })
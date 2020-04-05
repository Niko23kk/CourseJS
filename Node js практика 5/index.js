const sql = require("mssql");
const fs = require("fs");
let url = require("url");
const http = require("http");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;

let config = {
    "host": "localhost",
    "username": "Node",
    "password": "12345",
    "database": "NAO",
    "dialect": "mssql",
    "dialectOptions": {
        "multipleStatements": true
    }
};


const sequelize = new Sequelize(config);
sequelize.authenticate()
    .then(() => {
        console.log("Соединение с базой данных установленно");
    })

let usedb = `use ${config.database}`;
const httpServer = http.createServer();



function get(table) {
    return tableStructur[table].findAll();
}

function insert(table, fields) {
    return tableStructur[table].create(fields);
}

function update(table, fields) {
    let where = {};
    let update = {};
    for (const key in fields) {
        if (key.toUpperCase() !== table.toUpperCase())
            update[key] = fields[key];
        else
            where[table.toUpperCase()] = fields[table.toUpperCase()];
    }
    let wherenew = { where: where };
    return tableStructur[table].update(update, wherenew);
}

function getOne(table, value) {
    return tableStructur[table].findOne({
        'where': {
            [table]: value
        }
    });
}

function del(table, value) {
    return tableStructur[table].destroy({
        'where': {
            [table]: value
        }
    });
}

httpServer.listen(3000)
    .on("request", (req, res) => {

        let tableArray = ["faculty", "pulpit", "subject", "auditorium_type", "auditorium"];

        if ((req.method === "GET") && (req.url === "/api/faculties" || req.url === "/api/pulpits" || req.url === "/api/subjects" ||
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

            get(table).then(result => {
                    res.end(JSON.stringify(result));
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
                            res.end(JSON.stringify(result.dataValues));
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

class faculty extends Model {};
class pulpit extends Model {};
class subject extends Model {};
class teacher extends Model {};
class auditorium_type extends Model {};
class auditorium extends Model {};


let tableStructur = {

    faculty: faculty.init({
        FACULTY: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
        FACULTY_NAME: { type: Sequelize.STRING }
    }, { sequelize, modelName: "faculty", tableName: "faculty", timestamps: false }),

    pulpit: pulpit.init({
        PULPIT: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
        PULPIT_NAME: { type: Sequelize.STRING },
        FACULTY: { type: Sequelize.STRING, references: "FACULTY", referencesKey: "FACULTY" }
    }, { sequelize, modelName: "pulpit", tableName: "pulpit", timestamps: false }),

    subject: subject.init({
        SUBJECT: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
        SUBJECT_NAME: { type: Sequelize.STRING },
        PULPIT: { type: Sequelize.STRING, references: "PULPIT", referencesKey: "PULPIT" }
    }, { sequelize, modelName: "subject", tableName: "subject", timestamps: false }),

    teacher: teacher.init({
        TEACHER: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
        TEACHER_NAME: { type: Sequelize.STRING },
        PULPIT: { type: Sequelize.STRING, references: "PULPIT", referencesKey: "PULPIT" }
    }, { sequelize, modelName: "teacher", tableName: "teacher", timestamps: false }),

    auditorium_type: auditorium_type.init({
        AUDITORIUM_TYPE: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
        AUDITORIUM_TYPENAME: { type: Sequelize.STRING }
    }, { sequelize, modelName: "auditorium_type", tableName: "auditorium_type", timestamps: false }),

    auditorium: auditorium.init({
        AUDITORIUM: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
        AUDITORIUM_NAME: { type: Sequelize.STRING },
        AUDITORIUM_CAPACITY: { type: Sequelize.INTEGER },
        AUDITORIUM_TYPE: { type: Sequelize.STRING, references: "AUDITORIUM_TYPE", referencesKey: "AUDITORIUM_TYPE" }
    }, { sequelize, modelName: "auditorium", tableName: "auditorium", timestamps: false })
}
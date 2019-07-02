"use strict";
var express = require('express');
var router = express.Router();

const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const Types = require('tedious').TYPES;

const config = {
    authentication: {
        type: 'default',
        options: {
            userName: 'hinas913',
            password: 'Q8s7wmvj'
        }
    },
    server: 'hinashun.database.windows.net',
    options: { database: 'TestDB', encrypt: true, useColumnNames: true }
};

router.get('/', (req, res) => {
    let id = req.query.id;
    const connection = new Connection(config);

    connection.on('connect', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('接続成功');
            ShowDatabase(res, connection, id);
            function ShowDatabase(res, connection, id) {
                let result;
                let request = new Request("SELECT * FROM dbo.mydata WHERE id = @ID",
                    function (err, rowCount) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(rowCount);
                        }
                        connection.close();
                    });
                    request.addParameter('ID', Types.Int, id); 

                request.on('row', function (columns) {
                    if (columns === null)
                        console.log("何も入っていません。");
                    else {
                        result = columns;
                    }
                });

                let complete = function (cnt, more) {
                    const data = {
                        title: "Database succeeded!",
                        content: "テーブル内の情報",
                        result: result
                    };
                    res.render("hello/show", data);
                };
                request.on("doneInproc", complete);
                request.on("doneProc", complete);

                request.on("done", complete);

                connection.execSql(request);
            };
        };
    });
});
module.exports = router;

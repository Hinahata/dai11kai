let express = require('express');
let router = express.Router();

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

/* GET home page. */
router.get('/', (req, res) => {
    const data = {
        title: "Hello/Add",
        content: "新しいレコードを入力"
    };
    res.render("hello/add", data);
});

router.post('/', (req, res) => {
    let name = req.body.name;
    let mail = req.body.mail;
    let age = req.body.age;

    const connection = new Connection(config);

    connection.on('connect', function (err) {
        if (err) {
            console.log('エラーが発生しました');
        } else {
            console.log('接続成功');
            AddDatabase(res, connection, name, mail, age);
        }
        function AddDatabase(res, connection, name, mail, age) {
            let results = [];
            let request = new Request("INSERT INTO mydata (name, mail, age) VALUES (@NAME, @MAIL, @AGE);",
                function (err, rowCount) {
                    if (err) {
                        console.log(err);
                        res.redirect('/hello');
                    } else {
                        console.log(rowCount);
                    }
                    connection.close();
                });
            request.addParameter('NAME', Types.NVarChar, name);
            request.addParameter('MAIL', Types.NVarChar, mail);
            request.addParameter('AGE', Types.Int, age);
            request.on('row', function (columns) {
                if (columns === null)
                    console.log("何も入っていません。");
                else {
                    results.push(columns);
                }
            });

            let complete = function (cnt, more) {
                const data = {
                    title: "Hello/Add!",
                    content: "新しいレコードを入力：",
                    result: results
                };
                res.redirect('/hello');
            };
            request.on("doneInproc", complete);
            request.on("doneProc", complete);

            request.on("done", complete);

            connection.execSql(request);
        };
    });
});


module.exports = router;

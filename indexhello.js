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
  options: { database: 'TestDB', encrypt: true ,useColumnNames:true}
};

router.get('/', (req, res) => {
  const data = {
    title: "error",
    content: "エラーです"
  };
  const connection = new Connection(config);

  connection.on('connect', function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('接続成功');
      queryDatabase(res, connection);
      function queryDatabase(res, connection) {
        let results = [];

      let request = new Request("SELECT * FROM dbo.mydata",
          function (err,rowCount) {
            if(err){
              console.log(err);
            }else{
              console.log(rowCount);
            }
            connection.close();
          });
        request.on('row', function (columns) {
          if (columns === null)
            console.log("何も入っていません。");
          else{
            results.push(columns);
          }
        });

        let complete = function (cnt, more) {
          const data = {
            title: "Database succeeded!",
            content: "テーブル内の情報",
            result: results
          };
          res.render("hello/indexhello.ejs", data);
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
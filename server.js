'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.get('/', (req, res) => {
  var mysql = require('mysql');
  var con = mysql.createConnection({
    host: "mymysql",
    port: "3306",
    user: "root",
    password: "my-secret-pw",
    database: 'myDB'
  });

  con.connect(function(err) {
    if (err) throw err;
    con.query("select value from myTABLE where id=1;", function (err, result, fields) {
      if (err) throw err;
      res.send(result[0].value);
    });
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

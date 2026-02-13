// server.js
// where your node app starts

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

const setup = () => {
  if (!exists) {
    db.run(
      "CREATE TABLE IdMap (myId varchar(36) primary key, yourId varchar(36) not null)"
    );
    console.log("New table IdMap created!");
  } else {
    console.log('Database "IdMap" ready to go!');
    db.each("SELECT * from IdMap", (err, row) => {
      if (row) {
        console.log(`${row.myId} -> ${row.yourId}`);
      }
    });
  }
};

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(setup);

app.get("/", (_, response) => {
  response.sendFile(`${__dirname}/views/index.htm`);
});

// Get all IDs
app.get("/ids", (_, response) => {
  db.all("SELECT * from IdMap", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

// Add a mapped ID
app.post("/id", (request, response) => {
  const myId = request.body.myId;
  const yourId = request.body.yourId;
  console.log(`Write ${myId} -> ${yourId}`);

  db.run(
    `INSERT INTO IdMap (myId, yourId) VALUES (?, ?)`,
    myId,
    yourId,
    (error) => {
      if (error) {
        response.send({ message: "error!" });
      } else {
        response.send({ message: "success" });
      }
    }
  );
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

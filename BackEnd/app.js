/*const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database(
  "./userdetails.db",
  sqlite3.OPEN_READWRITE,
  (error) => {
    if (error) return console.error(error.message);
    console.log("Connected to the database.");
  }
);
app.listen(4000, () => {
  console.log("Server Running at http://localhost:4000");
});

db.run(
  `CREATE TABLE userdetails(id INTEGER PRIMARY KEY,username VARCHAR(200),email VARCHAR(200),password VARCHAR(200))`
);

let sql = `INSERT INTO userdetails(username,email,password,score) VALUES (?,?,?,?)`;

db.run(sql, ["thiru", "thiru@gmail.com", "thiru@123", 0], (err) => {
  if (err) return console.log(err.message);
});



db.run(`ALTER TABLE userdetails ADD score INTEGER`, [], (err) => {
  if (err) return console.log(err.message);
}); 

db.run(`DELETE FROM userdetails`, [], (err) => {
  if (err) return console.log(err.message);
});

table = `SELECT * FROM userdetails`;
db.all(table, [], (err, rows) => {
  if (err) return console.error(err.message);
  rows.forEach((row) => {
    console.log(row);
  });
}); */

const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dbPath = path.join(__dirname, "userdetails.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4000, () => {
      console.log("Server Running at http://localhost:4000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.post("/register", async (request, response) => {
  const { username, email } = request.body;
  const hashedPassword = await bcrypt.hash(request.body.password, 10);
  const selectUserQuery = `SELECT * FROM userdetails WHERE username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    const createUserQuery = `
        INSERT INTO 
          userdetails (username, email, password, score) 
        VALUES 
          (
            '${username}', 
            '${email}',
            '${hashedPassword}',
            ${0}
          )`;
    await db.run(createUserQuery);
    response.send("Register Successfully");
  } else {
    response.status = 400;
    response.send("User already exists");
  }
});

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM userdetails WHERE username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid User");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      const payload = {
        username: username,
      };
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        request.username = payload.username;
        next();
      }
    });
  }
};

app.get("/profile", authenticateToken, async (request, response) => {
  const username = request.username;
  const getUserQuery = `
            SELECT
              *
            FROM
             userdetails
            WHERE
             username='${username}';`;
  const userArray = await db.all(getUserQuery);
  response.send(userArray);
});

const zigzagWords_30 = [
  { zigzagWord: "lapep", correctWord: "apple" },
  { zigzagWord: "otmehr", correctWord: "mother" },
  { zigzagWord: "ent", correctWord: "ten" },
  { zigzagWord: "atc", correctWord: "cat" },
  { zigzagWord: "gdo", correctWord: "dog" },
  { zigzagWord: "unrngni", correctWord: "running" },
  { zigzagWord: "lncae", correctWord: "clean" },
  { zigzagWord: "ttras", correctWord: "start" },
  { zigzagWord: "edu", correctWord: "due" },
  { zigzagWord: "het", correctWord: "the" },
  { zigzagWord: "eh", correctWord: "he" },
  { zigzagWord: "bsu", correctWord: "bus" },
  { zigzagWord: "ixte", correctWord: "exit" },
  { zigzagWord: "ouy", correctWord: "you" },
  { zigzagWord: "anc", correctWord: "can" },
  { zigzagWord: "tge", correctWord: "get" },
  { zigzagWord: "etcrae", correctWord: "create" },
  { zigzagWord: "ecsussc", correctWord: "success" },
];

app.put("/game", authenticateToken, async (request, response) => {
  const { score } = request.body;
  const username = request.username;
  const updateBookQuery = `
  UPDATE userdetails
  SET score=?
  WHERE username=?`;
  await db.run(updateBookQuery, [score, username]);
  const random = Math.floor(Math.random() * zigzagWords_30.length);
  response.send(zigzagWords_30[random]);
});

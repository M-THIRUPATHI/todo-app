/*const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database(
  "./userdetail.db",
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
  `CREATE TABLE todo(id INTEGER PRIMARY KEY,username VARCHAR(200),todo VARCHAR(200),status VARCHAR(200))`
); 

let sql = `INSERT INTO todo(username,todo,status) VALUES (?,?,?)`;

db.run(sql, ["thiru", "Assignment", "pending"], (err) => {
  if (err) return console.log(err.message);
});

db.run(`ALTER TABLE userdetails ADD score INTEGER`, [], (err) => {
  if (err) return console.log(err.message);
}); 

db.run(`DELETE FROM userdetail`, [], (err) => {
  if (err) return console.log(err.message);
}); 

table = `SELECT * FROM todo`;
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

const dbPath = path.join(__dirname, "userdetail.db");

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
  const selectUserQuery = `SELECT * FROM userdetail WHERE username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    const createUserQuery = `
        INSERT INTO 
          userdetail (username, email, password) 
        VALUES 
          (
            '${username}', 
            '${email}',
            '${hashedPassword}'
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
  const selectUserQuery = `SELECT * FROM userdetail WHERE username = '${username}'`;
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
             userdetail
            WHERE
             username='${username}';`;
  const userArray = await db.all(getUserQuery);
  response.send(userArray);
});

app.get("/", authenticateToken, async (request, response) => {
  const username = request.username;
  const getUserQuery = `
            SELECT
              *
            FROM
             todo
            WHERE
             username='${username}';`;
  const userArray = await db.all(getUserQuery);
  response.send(userArray);
});

app.post("/add", authenticateToken, async (request, response) => {
  const username = request.username;
  const { todo, status } = request.body;
  const insertQuery = `
  INSERT INTO 
    todo (username, todo, status) 
  VALUES 
    (?, ?, ?)`;
  await db.run(insertQuery, [username, todo, status]);
  response.send("Add successfully");
});

app.put("/edit/:id/", authenticateToken, async (request, response) => {
  const { id } = request.params;
  const { status } = request.body;
  const updateQuery = `
    UPDATE
      todo
    SET
      status='${status}'
    WHERE
      id = ${id};`;
  await db.run(updateQuery);
  response.send("Updated Successfully");
});

app.delete("/delete/:id", authenticateToken, async (request, response) => {
  const { id } = request.params;
  const deleteQuery = `
    DELETE FROM
      todo
    WHERE
      id = ${id};`;
  await db.run(deleteQuery);
  response.send("Deleted Successfully");
});

/*const zigzagWords_30 = [
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
 */

const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const dbPath = path.join(__dirname, "goodreads.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// Get Books API
app.get("/books/", async (request, response) => {
  const getBooksQuery = `
  SELECT
    *
  FROM
    book
  ORDER BY
    book_id;`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

//CREATE USER API

app.post("/users/", async (req, res) => {
  const { username, name, password, gender, location } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `select * from user where username=?`;
  const dbUser = await db.get(selectUserQuery, username);
  if (dbUser === undefined) {
    //create user in table
    const createUserQuery = `insert into user(username,name,password,gender,location) values(?,?,?,?,?)`;
    await db.run(createUserQuery, [
      username,
      name,
      hashedPassword,
      gender,
      location,
    ]);
    res.send("User Created Successfully");
  } else {
    //send invalid username
    res.status(400);
    res.send("User Name Already Exists");
  }
});

//user login api

app.post("/login/", async (req, res) => {
  const { username, password } = req.body;
  const selectUserQuery = `select * from user where username=?`;
  const dbUser = await db.get(selectUserQuery, username);
  if (dbUser === undefined) {
    //User Don't exist
    res.status(400);
    res.send("Invalid User");
  } else {
    //verify password
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched) {
      res.send("Login Success");
    } else {
      res.status(400);
      res.send("Invalid Password");
    }
  }
});

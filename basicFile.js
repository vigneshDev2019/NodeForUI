//imports
const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

//middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connection
const pool = mysql.createPool({
  host: "sql12.freemysqlhosting.net",
  user: "sql12607833",
  password: "ew5F5tzTT2",
  database: "sql12607833",
  connectionLimit: 100, // set connection limit
});

app.get("/Cars", async (req, res) => {
  const connection = await pool.getConnection();
  const [rows, fields] = await connection.query(
    "SELECT * FROM sql12607833.CarsCollection"
  );
  connection.release();
  res.send(rows);
});

app.get("/Model", async (req, res) => {
  const Make = req.query.Make;
  const connection = await pool.getConnection();
  const [rows, fields] = await connection.query(
    "SELECT DISTINCT Model FROM sql12607833.CarsCollection WHERE Make = ?",
    [Make]
  );
  connection.release();
  res.send(rows);
});

app.get("/Year", async (req, res) => {
  const Make = req.query.Make;
  const Model = req.query.Model;
  const connection = await pool.getConnection();
  const [rows, fields] = await connection.query(
    "SELECT DISTINCT Year FROM sql12607833.CarsCollection WHERE Make = ? && Model = ?",
    [Make, Model]
  );
  connection.release();
  res.send(rows);
});

app.get("/Filtered", async (req, res) => {
  const Make = req.query.Make;
  const Model = req.query.Model;
  const Year = req.query.Year;
  const connection = await pool.getConnection();
  const [rows, fields] = await connection.query(
    "SELECT * FROM sql12607833.CarsCollection WHERE Make = ? && Model = ? && Year = ?",
    [Make, Model, Year]
  );
  connection.release();
  res.send(rows);
});

app.put("/UpdateCars", async (req, res) => {
  const values = req.body;
  const connection = await pool.getConnection();
  values.forEach(async (value) => {
    const query = `UPDATE sql12607833.CarsCollection SET Status = 1 WHERE Id = ${value}`;
    await connection.query(query);
  });
  connection.release();
  res.status(200).send("Update successful");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// close the connection pool when the application is shutting down
process.on("SIGINT", () => {
  server.close(() => {
    pool.end((err) => {
      if (err) throw err;
      console.log("Connection pool closed");
    });
  });
});

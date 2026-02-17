const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",            // your PostgreSQL username
  host: "localhost",
  database: "smart_notes_db",  // the database you just created
  password: "Teerth1111",   // replace with your postgres password
  port: 5432,
});

module.exports = pool;

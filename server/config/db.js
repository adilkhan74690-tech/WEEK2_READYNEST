const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mysql = require("mysql2");
const { initializeDatabase } = require("./initDb");

console.log("HOST:", process.env.DB_HOST);
console.log("PORT:", process.env.DB_PORT || 3306);
console.log("USER:", process.env.DB_USER);
console.log("DB:", process.env.DB_NAME);

const connectionConfig = (process.env.MYSQL_URL || process.env.DATABASE_URL)
  ? (process.env.MYSQL_URL || process.env.DATABASE_URL)
  : {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };

const db = mysql.createConnection(connectionConfig);

db.connect(async (err) => {
  if (err) {
    console.error("MySQL Connection Error:", err);
  } else {
    console.log("✅ MySQL Connected Successfully");
    try {
      await initializeDatabase(db);
    } catch (dbErr) {
      console.error("❌ MySQL Schema Setup Failed:", dbErr);
    }
  }
});

module.exports = db;
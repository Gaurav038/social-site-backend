const mysql = require("mysql2")
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.NODE_ENV == "localhost" ? "localhost" : process.env.DB_HOST,
    user: process.env.NODE_ENV == "localhost" ? "root" : process.env.DB_USER,
    password: process.env.NODE_ENV == "localhost" ? "......" : process.env.DB_PASSWORD,
    database: process.env.NODE_ENV == "localhost" ? "social" : process.env.DB_NAME,
    port: process.env.NODE_ENV == "localhost" ? 3306 : process.env.DB_PORT
})

module.exports = db
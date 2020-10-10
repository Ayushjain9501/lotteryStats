const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

// Create a connection to the database

const sql = mysql.createPool({
	host: dbConfig.HOST,
	user: dbConfig.USER,
	password: dbConfig.PASSWORD,
	database: "lottery",
	connectionLimit: dbConfig.LIMIT,
	dateStrings: true,
});

module.exports = sql;

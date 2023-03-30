const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

// To get access to the .env file
dotenv.config();

// Configs to access mysql
const db = process.env.MYSQL_DB;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;

// Port mysql
const port = process.env.MYSQL_PORT;

const sequelize = new Sequelize(db, user, password, {
  dialect: "mysql",
  port: port,
});

module.exports = sequelize;

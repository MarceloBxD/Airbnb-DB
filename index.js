const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const router = require("./src/routes");
const sequelize = require("./src/database/mysql");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

// Usar o body-parser para pegar os dados do formulário
app.use(router);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

sequelize.authenticate().then(() => {
  console.log("Conectado ao banco de dados");
});

app.listen(process.env.PORT);

const express = require("express");
const router = express.Router();
const ApiController = require("../controllers/ApiController");
const Auth = require("../middlewares/auth");

router.post("/register", ApiController.register);

router.get("/login", ApiController.login);

router.get("/list", Auth.private, ApiController.list);

router.get("/:course/fluxograma", ApiController.fluxograma);

module.exports = router;

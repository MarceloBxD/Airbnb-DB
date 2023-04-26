const express = require("express");
const router = express.Router();
const ApiController = require("../controllers/ApiController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/register", ApiController.register);

router.post("/login", ApiController.login);

router.get("/places", ApiController.places);

router.get("/details/:id", ApiController.details);

router.post("/register-place", ApiController.registerPlace);

router.get("/ordem-alfabetica", ApiController.ordemAlfabetica);

router.get("/ordem-menor-preco", ApiController.ordemMenorPreco);

router.get("/ordem-maior-preco", ApiController.ordemMaiorPreco);

router.post("/place", ApiController.place);

router.post("/upload-by-link", ApiController.uploadByLink);

module.exports = router;

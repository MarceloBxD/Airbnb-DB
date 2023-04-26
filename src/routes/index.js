const express = require("express");
const router = express.Router();
const ApiController = require("../controllers/ApiController");
const AuthController = require("../controllers/AuthController");
const PlaceController = require("../controllers/PlaceController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.get("/places", ApiController.places);

router.get("/details/:id", ApiController.details);

router.post("/register-place", PlaceController.registerPlace);

router.get("/ordem-alfabetica", PlaceController.ordemAlfabetica);

router.get("/ordem-menor-preco", PlaceController.ordemMenorPreco);

router.get("/ordem-maior-preco", PlaceController.ordemMaiorPreco);

router.post("/place", PlaceController.place);

router.post("/upload-by-link", ApiController.uploadByLink);

module.exports = router;

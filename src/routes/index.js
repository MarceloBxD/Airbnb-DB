const express = require("express");
const router = express.Router();
const ApiController = require("../controllers/ApiController");
const AuthController = require("../controllers/AuthController");
const PlaceController = require("../controllers/PlaceController");
const Auth = require("../middlewares/auth");
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
const photosMiddleware = multer({ dest: "uploads/" });

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post('/logout', AuthController.logout)

router.post(
  "/uploads",
  photosMiddleware.single("photos"),
  PlaceController.uploads
);

router.post("/register-place", PlaceController.registerPlace);

router.post("/place", PlaceController.place);

router.get("/ordem-alfabetica", PlaceController.ordemAlfabetica);

router.get("/ordem-menor-preco", PlaceController.ordemMenorPreco);

router.get("/ordem-maior-preco", PlaceController.ordemMaiorPreco);

router.post("/upload-by-link", ApiController.uploadByLink);

router.get("/profile", AuthController.profile);

router.get("/places", PlaceController.places);

module.exports = router;

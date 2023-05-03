// Modals
const User = require("../models/User");
const Places = require("../models/Place");
const dotenv = require("dotenv");
const download = require("image-downloader");

// Criptografia de senha

dotenv.config();

// Controller para listar os usuários (só é possivel se o usuário estiver logado, com um token sendo passado no header )
const list = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// List

const places = async (req, res) => {
  try {
    const places = await Places.findAll();
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const details = async (req, res) => {
  try {
    const places = await Places.findByPk(req.params.id);
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadByLink = async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";

  const options = {
    url: link,
    dest: "../../uploads/" + newName,
  };

  await download
    .image(options)
    .then(({ filename }) => {
      console.log("Saved to", filename);
    })
    .catch((err) => console.error(err));

  res.json(newName);
};

module.exports = {
  list,
  places,
  details,
  uploadByLink,
};

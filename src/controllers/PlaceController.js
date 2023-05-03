const Places = require("../models/Place.js");

const registerPlace = async (req, res) => {
  const { name, address, category, price, description, image } = req.body;

  if (!name || !address || !category || !price || !description)
    return res.status(400).json({ message: "Preencha todos os campos" });

  try {
    const placeExists = await Places.findOne({ name });

    if (!placeExists) {
      const place = await Places.create({
        name,
        address,
        category,
        price,
        description,
        image,
      });

      res.status(201).json({ place });
    } else {
      res.status(400).json({ message: "Place already exists" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const ordemAlfabetica = async (req, res) => {
  try {
    const places = await Places.find({}).sort({ name: 1 });
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const ordemMenorPreco = async (req, res) => {
  try {
    const places = await Places.find({
      // ordenar por menores preços
    }).sort({ price: 1 });
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const ordemMaiorPreco = async (req, res) => {
  try {
    const places = await Places.find({}).sort({ price: -1 });
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const places = async (req, res) => {
  try {
    const places = await Places.find({});
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const place = async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res.status(400).json({ message: "Preencha o campo de pesquisa!" });

  try {
    const place = await Places.find({
      // procurar por lugares parecidos com o que foi digitado
      name: { $regex: name, $options: "i" },
    });

    if (place) {
      res.status(200).json({ place });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploads = async (req, res) => {
  res.json(req.files);
};

module.exports = {
  registerPlace,
  ordemAlfabetica,
  ordemMenorPreco,
  ordemMaiorPreco,
  place,
  uploads,
  places,
};

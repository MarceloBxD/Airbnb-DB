const { Op } = require("sequelize");

const registerPlace = async (req, res) => {
  const { name, address, category, price, description, image } = req.body;

  if (!name || !address || !category || !price || !description)
    return res.status(400).json({ message: "Preencha todos os campos" });

  try {
    const placeExists = await Places.findOne({ where: { name } });

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
    const places = await Places.findAll({
      order: [["name", "ASC"]],
    });
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const ordemMenorPreco = async (req, res) => {
  try {
    const places = await Places.findAll({
      order: [["price", "ASC"]],
    });
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const ordemMaiorPreco = async (req, res) => {
  try {
    const places = await Places.findAll({
      order: [["price", "DESC"]],
    });
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
    const place = await Places.findAll({
      where: {
        [Op.or]: [
          {
            name: { [Op.like]: `%${name}%` },
          },
          {
            description: { [Op.like]: `%${name}%` },
          },
          {
            category: { [Op.like]: `%${name}%` },
          },
        ],
      },
    });

    if (place) {
      res.status(200).json({ place });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerPlace,
  ordemAlfabetica,
  ordemMenorPreco,
  ordemMaiorPreco,
  place,
};

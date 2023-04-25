// Modals
const Users = require("../models/User");
const Places = require("../models/Place");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Criptografia de senha
const bcrypt = require("bcrypt");

dotenv.config();

// Controller de Login
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({
    where: {
      email,
    },
  });

  if (user) {
    const passOk = bcrypt.compareSync(password, user.password);
    if (passOk) {
      jwt.sign(
        {
          email: user.email,
          id: user.id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "24h" },
        (err, token) => {
          if (err) throw err;
          else {
            res.cookie("token", token).json(user);
          }

          // quando der reload, o token nao sai
        }
      );
    } else {
      res.status(422).json("Pass not ok");
    }
  } else {
    res.status(422).json("User not found");
  }
}; // Login

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Preencha todos os campos" });

  try {
    const userExists = await Users.findOne({ where: { email } });

    if (!userExists) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await Users.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );
      res.status(200).json({ user, token });
    } else {
      res.status(400).json({ message: "User already exists" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; // Register

// Controller para listar os usuários (só é possivel se o usuário estiver logado, com um token sendo passado no header )
const list = async (req, res) => {
  try {
    const users = await Users.findAll();
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

const registerPlace = async (req, res) => {
  const { name, address, category, price, description } = req.body;

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
      });

      res.status(200).json({ place });
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
    const place = await Places.findAll({ where: { name } });

    if (place) {
      res.status(200).json({ place });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  login,
  register,
  list,
  places,
  details,
  registerPlace,
  ordemAlfabetica,
  ordemMenorPreco,
  ordemMaiorPreco,
  place,
};

const Users = require("../models/models");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fluxogramaComp = require("../dataCourse/engComp");

dotenv.config();

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ where: { email, password } });

    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );
      res.status(200).json({ user, token });
    } else {
      res.status(400).json("Login Failed");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const register = async (req, res) => {
  const { name, email, password, course } = req.body;
  try {
    const userExists = await Users.findOne({ where: { email } });

    if (!userExists) {
      const user = await Users.create({
        name,
        email,
        password,
        course,
      });

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );
      res.status(200).json({ user, token });
    } else {
      res.status(400).json({ message: "User already exists" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const fluxograma = async (req, res) => {
  const { course } = req.params;

  let fluxograma = [];

  if (course == "eng-comp") {
    fluxograma = fluxogramaComp;
  } else if (course == "eng-mec") {
    fluxograma = [];
  }

  try {
    res.status(200).json({ fluxograma });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const list = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  list,
  fluxograma,
};

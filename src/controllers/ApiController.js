const Users = require("../models/models");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fluxogramaComp = require("../dataCourse/engComp");

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
    console.log(password, user.password);
    if (passOk) {
      jwt.sign(
        {
          email: user.email,
          id: user.id,
        },
        process.env.SECRET_KEY,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json("pass ok! Loggin Success");
        }
      );
    } else {
      res.status(422).json("Pass not ok");
    }
  } else {
    res.status(422).json("User not found");
  }
};

// Controller de Registro

const register = async (req, res) => {
  const { name, email, password, course } = req.body;
  try {
    const userExists = await Users.findOne({ where: { email } });

    if (!userExists) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await Users.create({
        name,
        email,
        password: hashedPassword,
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

// Controller de Fluxograma de cada curso

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

// Controller para listar os usuários (só é possivel se o usuário estiver logado, com um token sendo passado no header )
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

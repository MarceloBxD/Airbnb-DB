const bcrypt = require("bcrypt");
const Users = require("../models/User");
const jwt = require("jsonwebtoken");

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

module.exports = {
  login,
  register,
};

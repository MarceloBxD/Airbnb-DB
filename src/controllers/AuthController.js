const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const passOk = bcrypt.compareSync(password, user.password);
    if (passOk) {
      jwt.sign(
        {
          name: user.name,
          email: user.email,
          id: user._id,
        },
        process.env.SECRET_KEY,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token, { httpOnly: true }).status(200).json(user);
          console.log(token);
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
    const userExists = await User.findOne({ where: { email } });

    if (!userExists) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
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

const profile = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, {}, async (err, decoded) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(decoded.id);
      res.status(200).json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
};

const logout = async (req, res) => {
  res.cookie("token", "").json("Logged out");
};

module.exports = {
  login,
  register,
  profile,
  logout,
};

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const Auth = {
  private: async (req, res, next) => {
    let success = false;
    console.log(req);
    if (req.headers.authorization) {
      const [authType, token] = req.headers.authorization.split(" ");

      if (authType === "Bearer") {
        try {
          jwt.verify(token, process.env.SECRET_KEY);
          success = true;
        } catch (err) {}
      }
    }

    if (success) {
      next();
    } else {
      res.status(401).json({ message: "Não autorizado" });
    }
  },
};

module.exports = Auth;

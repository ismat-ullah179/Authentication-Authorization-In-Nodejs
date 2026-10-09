const bcrypt = require("bcrypt");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        message: "Enter into the fields first",
      });
    }
    //if user Already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already Registered",
      });
    }

    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 12);

    //creating data to user Model
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "User Registered SuccessFully",
      user: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
module.exports = { register };

const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
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

// login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please Enter Email & Password",
      });
    }
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        message: "Invalid Email or Password",
      });
    }
    console.log("Email:", email);
    console.log("User found:", !!user);
    console.log("Password received:", !!password);
    console.log("Hash exists:", !!user?.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      message: "Login Successfully",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Internal Error",
      error: error.message,
    });
  }
};
module.exports = { register, login };

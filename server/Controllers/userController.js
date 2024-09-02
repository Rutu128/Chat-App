const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET;

  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await userModel.findOne({ email: email });
    if (user) {
      return res.status(400).json("Email already exists");
    }
    if (!name || !email || !password) {
      return res.status(400).json("Please fill all the fields");
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json("Invalid email address");
    }

    if (!validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json(
          "Password must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number, 1 symbol"
        );
    }

    user = new userModel({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = createToken(user._id);

    res.status(200).json({
      _id: user._id,
      token,
      name,
      email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error", error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json("Invalid credentials");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json("Invalid credentials");
    }
    const token = createToken(user._id);
    res.status(200).json({
      _id: user._id,
      token,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error", error);
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error", error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error", error);
  }
};
module.exports = {
  registerUser,
  loginUser,
  findUser,
  getUsers,
};

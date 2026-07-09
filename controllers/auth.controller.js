import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const TOKEN_EXPIRES = "24h";

const createToken = (userId, role) => {
  return jwt.sign({ _id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRES,
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000,
};

export async function register(req, res) {
  const { username, email, password, role = "user" } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password should be at least of 8 characters",
    });
  }

  try {
    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      email,
      password: hashPassword,
      role,
    });

    const token = createToken(user._id, user.role);

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      message: "User registered successfully!",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user._id, user.role);

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      message: "User Login successfully!",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export function logout(req, res) {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logged out successfully",
  });
}

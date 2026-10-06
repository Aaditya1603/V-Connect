import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt, { hash } from "bcrypt";

import crypto from "crypto";

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please Provide credentials" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User Not Found" });
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      let token = crypto.randomBytes(20).toString("hex");

      user.token = token;
      await user.save();
      return res.status(httpStatus.OK).json({ token: token });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid Password" });
    }
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong ${e}` });
  }
};

const register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(httpStatus.CREATED).json({ message: "User Registered" });
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body; // Adjust based on how your frontend sends it

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }

    if (!user.history) {
      user.history = [];
    }

    // Pushes the meeting code into your User model's history array
    user.history.push({ meetingCode: meeting_code, date: new Date() });

    user.markModified("history");

    await user.save();

    return res
      .status(httpStatus.OK)
      .json({ message: "Added to history successfully" });
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong ${e}` });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.history || []);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export { login, register, addToHistory };

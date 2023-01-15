/** @format */

import express from "express";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import User from "../models/users.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import Authmiddleware from "../middleware/Authmiddleware.js";

const router = express.Router();

router.get("/details", Authmiddleware, async (req, res) => {
  try {
    if (req.user) {
      const userDetails = await User.findOne({ userId: req.user.userId });
      if (userDetails) {
        return res.status(200).json(userDetails);
      }
    } else {
      console.log(err);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const checkEmail = await User.findOne({ email });
  if (!checkEmail) {
    return res.status(200).json({ noEmail: true });
  } else {
    const [salt, key] = checkEmail.password.split(":");
    const hashedBuffer = scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");
    const match = timingSafeEqual(hashedBuffer, keyBuffer);
    if (match) {
      const { userId, email } = checkEmail;
      const token = jwt.sign({ userId, email }, "key", { expiresIn: "24h" });

      return res.status(200).json({
        noEmail: false,
        passwordErr: false,
        userData: checkEmail,
        token,
      });
    } else {
      return res.status(200).json({ noEmail: false, passwordErr: true });
    }
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password, profileUrl } = req.body;
  console.log(username);
  const checkUsername = await User.findOne({ username: username });
  const checkEmail = await User.findOne({ email });

  if (checkUsername) {
    return res.json({ usernameExists: true });
  }
  if (checkEmail) {
    return res.json({ useremailExists: true, usernameExists: false });
  } else {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = scryptSync(password, salt, 64).toString("hex");
    const userId = nanoid();
    const date = new Date().toLocaleDateString();
    try {
      const newUser = new User({
        username,
        email,
        password: `${salt}:${hashedPassword}`,
        date,
        userId,
        profileUrl,
      });
      await newUser.save();
      const token = jwt.sign({ userId, email }, "key", { expiresIn: "24h" });

      res.status(200).json({
        useremailExists: false,
        usernameExists: false,
        userData: newUser,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "error" });
    }
  }
});
router.patch("/model/update/:id", async (req, res) => {
  const { username, email } = req.body.user;
  const url = req.body.url;

  const checkUser = await User.findOne({ userId: req.params.id });
  if (checkUser) {
    const updateUser = await User.findOneAndUpdate(
      { userId: req.params.id },
      {
        $set: { username: username, profileUrl: profileUrl, email: email },
      },
      {
        new: true,
      }
    );
    res.json(updateUser);
  }
});
export default router;

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    const body = req.body;
    const { username, email, password, connected } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userObj = new UserModel({
      username,
      email,
      password: hashedPassword,
      connected,
    });

    const createdUser = await userObj.save();
    return res.status(201).send(createdUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      "secretkey"
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const makeConnectionTrue = async (tokenFromSocket) => {
  const updatedConnectionToTrue = await UserModel.findByIdAndUpdate(
    userId,
    { connected: true },
    { new: true }
  );
  return res.status(200).json({ status: true, data: updatedConnectionToTrue });
};
module.exports = { registerUser, login, makeConnectionTrue };

const express = require("express");
const User = require("../models/user");
const router = new express.Router();
//create new user
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send("Cannot create user");
  }
});

//log in
router.post("/login", async (req, res) => {
  const user = await User.findByCredentials(req.body.email, req.body.password);

  try {
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

//get my profile
router.get("/users/me", async (req, res) => {});

//update myself
router.post("/users/me", async (req, res) => {});

//delete me
router.delete("/users/me", async (req, res) => {});

module.exports = router;

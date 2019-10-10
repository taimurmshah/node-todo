const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

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

//logout
router.post("/logout", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = user.tokens.filter(token => token.token !== req.token);

    await user.save();

    res.send("successfully logged out");
  } catch (err) {
    res.status(500).send(err);
  }
});

//logout ALL sessions
router.post("/logoutAll", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = [];
    await user.save();
    res.send("Logged out of all sessions");
  } catch (err) {
    res.status(500).send(err);
  }
});

//get my profile
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

//update myself
router.patch("/users/me", auth, async (req, res) => {
  try {
    const user = req.user;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "mood", "email", "password", "age"];

    const isValidOperation = updates.every(update =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      res.status(400).send("Invalid update parameters");
    }

    updates.forEach(update => {
      user[update] = req.body[update];
    });

    await user.save();

    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

//delete me
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;

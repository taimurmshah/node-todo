const express = require("express");
const Quest = require("../models/quest");
const auth = require("../middleware/auth");
const router = new express.Router();

//create a new quest
router.post("/quests", auth, async (req, res) => {
  console.log("hit");
  let quest = new Quest({ ...req.body, owner: req.user._id });

  try {
    await quest.save();
    res.status(201).send(quest);
  } catch (err) {
    res.status(400).send();
  }
});

//get all quests
router.get("/quests", auth, async (req, res) => {
  const user = req.user;
  try {
    await user
      .populate({
        path: "quests"
      })
      .execPopulate();
    res.send(user.quests);
  } catch (err) {
    res.status(400).send();
  }
});

//get quest by id
router.get("/quests/:id", auth, async (req, res) => {
  const user = req.user;
  try {
    const task = await Quest.findOne({ _id: req.params.id, owner: user._id });
    res.send(task);
  } catch (err) {
    res.status(400).send();
  }
});

//get only completed quests
router.get("/quests/done", auth, async (req, res) => {
  const user = req.user;
  try {
    await user
      .populate({
        path: "quests",
        match: {
          completed: true
        }
      })
      .execPopulate();
    res.send(user.quests);
  } catch (err) {
    res.status(500).send();
  }
});

//get unfinished quests
router.get("/quests/todo", auth, async (res, req) => {
  const user = req.user;
  try {
    await user
      .populate({
        path: "quests",
        match: {
          completed: false
        }
      })
      .execPopulate();
    res.send(user.quests);
  } catch (err) {
    res.status(500).send();
  }
});

//update a quest
router.patch("/quests/:id", auth, async (req, res) => {
  const user = req.user;
  try {
    const quest = await Quest.findOne({ _id: req.params.id, owner: user._id });
    if (!quest) return res.status(400).send();
    const possibleUpdates = ["title", "description", "completed"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update =>
      possibleUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send("Please enter valid update parameters");
    }

    updates.forEach(update => {
      quest[update] = req.body[update];
    });

    await quest.save();
    res.send(quest);
  } catch (err) {
    res.status(400).send();
  }
});

//delete a quest
router.delete("/quests/:id", auth, async (req, res) => {
  try {
    const quest = await Quest.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!quest) return res.status(400).send();
    await quest.remove();
    res.send({ quest, message: "quest deleted" });
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;

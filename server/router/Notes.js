const express = require("express");
const router = express.Router();
const middleware = require("../middleware/user_jwt");
const Notes = require("../models/notes");
router.get("/", middleware, async (req, res, next) => {
  const notes = await Notes.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    say: "hi",
    count: notes.length,
    message: notes,
  });
});
router.post("/", middleware, async (req, res) => {
  const { title } = req.body;
  console.log(title);
  const note = new Notes();
  note.user = req.user.id;
  note.title = title;
  await note.save();

  res.status(200).json({
    success: true,

    note: note,
  });
});
router.put("/:id", middleware, async (req, res) => {
  const note = await Notes.findByIdAndUpdate(req.params.id, {
    note: req.body.note,
  });
  console.log(req.body.note);
  res.status(200).json({
    success: true,
    note: note,
  });
});
router.get("/:userid/:id", async (req, res) => {
  const note = await Notes.findById(req.params.id);
  if (note.user == req.params.userid) {
    res.status(200).json({
      success: true,
      message: note,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Invalid URL",
    });
  }
});
module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotEnv = require("dotenv").config();

const PORT = 8000;
const corsOptions = {
  origin: "https://task-list-frontend-khaki.vercel.app/",
  optionSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  // .connect("mongodb://localhost:27017/taskDB")
  .then(() => console.log("connected to database successfully..."))
  .catch((error) => console.log(error));

const taskSchema = mongoose.Schema({
  task: { type: String },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { task } = req.body;
  const newTask = new Task({ task });
  await newTask.save();
  res.json(newTask);
});

app.put("/api/tasks/:id", async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

app.delete("/api/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "task deleted" });
});

module.exports = app;

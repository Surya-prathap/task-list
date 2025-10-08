const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotEnv = require("dotenv").config();

const PORT = 8000;

const app = express();

app.use(cors());
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

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/tasks", async (req, res) => {
  const { task } = req.body;
  const newTask = new Task({ task });
  await newTask.save();
  res.json(newTask);
});

app.put("/tasks/:id", async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "task deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

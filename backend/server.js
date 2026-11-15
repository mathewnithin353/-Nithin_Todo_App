
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Developer name
app.get("/name", (req, res) => {
  res.send(`Developer Name: ${process.env.DEVELOPER_NAME}`);
});

// Backend homepage
app.get("/", (req, res) => {
  res.redirect("https://nithin-todo-app.vercel.app/");
});

// Todo schema
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  }
});

const Todo = mongoose.model("Todo", todoSchema);

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch todos" });
  }
});

// Add todo
app.post("/todos", async (req, res) => {
  try {
    const todo = await Todo.create({ text: req.body.text });
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ message: "Failed to add todo" });
  }
});

// Edit todo
app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(todo);
  } catch (err) {
    res.status(400).json({ message: "Failed to update todo" });
  }
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete todo" });
  }
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
  });

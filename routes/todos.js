const express = require("express");
const router = express.Router();
const Todo = require("../models/todo"); // You should move the schema to models/todo.js
const isLoggedIn = require("../middleware/auth");

router.get("/todoList", isLoggedIn, async (req, res) => {
  const todos = await Todo.find({ user: req.user._id });
  res.render("todo_list.ejs", { newTodo: todos, Title: "Todo_List", user: req.user });
});

router.post("/todoList", async (req, res) => {
  try {
    const todoData = req.body.todo;
    todoData.user = req.user._id;
    await Todo.create(todoData);
    req.flash("success", "Todo created!");
    res.redirect("/todoList");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
});

router.put("/todoList/:id", async (req, res) => {
  await Todo.findByIdAndUpdate(req.params.id, req.body.todo);
  res.redirect("/todoList");
});

router.delete("/todoList/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.redirect("/todoList");
});

module.exports = router;

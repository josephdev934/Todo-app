const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// Signup
router.get("/signUp", (req, res) => {
  res.render("SignUp.ejs", { Title: "SignUp page" });
});

router.post("/signUp", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "A user with that email already exists.");
      return res.redirect("/signUp");
    }

    const newUser = new User({ username, email });
    await User.register(newUser, password);

    req.flash("success", "Signup successful! You can now login.");
    res.redirect("/login");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signUp");
  }
});

// Login
router.get("/login", (req, res) => {
  res.render("login", { Title: "Login_page" });
});

router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true
}), (req, res) => {
  req.flash("success", `Welcome back, ${req.user.username}!`);
  res.redirect("/todoList");
});

// Logout
router.get("/Logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success", "You have logged out from the App");
    res.redirect("/");
  });
});

module.exports = router;

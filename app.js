const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const session = require("express-session");

const User = require("./models/user");

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
})
.then(() => {
  console.log("Connected to MongoDB successfully");
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// Middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(session({
  secret: "I am 18yrs old",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/todos"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Todo App server started on port ${PORT}`);
});

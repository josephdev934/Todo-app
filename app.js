const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const User = require("./models/user");

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

// Session config with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET || "secret-session-key",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 14 * 24 * 60 * 60 // 14 days
  }),
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
  }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash messages
app.use(flash());
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

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home", { Title: "Todo_App" });
});

router.get("/about", (req, res) => {
  res.render("about.ejs", { Title: "About page" });
});

router.get("/Privacy%20policy", (req, res) => {
  res.render("privacy_policy.ejs", { Title: "Privacy policy" });
});

router.get("/Terms%20of%20Use", (req, res) => {
  res.render("terms_of_use.ejs", { Title: "Terms of use" });
});

router.get("/Sephwares", (req, res) => {
  res.render("sephwares.ejs", { Title: "SephWares page" });
});

module.exports = router;

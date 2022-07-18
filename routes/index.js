const express = require("express");
const router = express.Router();

const passport = require("passport"),
      User     = require("../models/user");

// show landing form
router.get("/", (req, res) =>{
    res.render("landing");
});

// show register form
router.get("/register", (req, res) => {
    res.render("register");
});

// handle sign up logic
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            req.flash('error', err.message);
            return res.redirect("back");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome! Hope you find this helpful " + user.username);
            res.redirect("/routines");
        });
    });
});

// show login form
router.get("/login", (req, res) => {
    res.render("login", {message: req.flash("error")});
});

// handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/routines",
        failureRedirect: "/login"
    }), (req, res) => {
});

// logout route
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if(err){
            console.log(err);
        } else {
            req.flash("success", "Logged you out!");
            res.redirect("back");
        }
    });
});

module.exports = router;
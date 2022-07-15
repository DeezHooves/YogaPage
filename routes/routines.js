const express = require("express");
const router = express.Router();
const Routine = require("../models/routine")


// INDEX - show all routines
router.get("/", (req, res) => {
    // Get all routines from DB
    Routine.find({}, (err, allRoutines) => {
        if(err){
            console.log(err);
        } else {
            res.render("routines/index", {routines:allRoutines});
        };
    });
});

// CREATE - add new routine to DB
router.post("/", isLoggedIn, (req, res) => {
    // get data from form and add to routines array
    let name = req.body.name,
        image = req.body.image,
        author = req.body.author,
        newRoutine = {name: name, image: image, author:author};
    // Create a new routine and save to DB
    Routine.create(newRoutine, (err, newlyCreated) =>{
        if(err){
            console.log(err);
        } else {
            // redirect back to routines page.
            res.redirect("/");
        }
    });
});

// NEW - shows more info about one routine
router.get("/new", isLoggedIn, (req, res) => {
    res.render("routines/new");
});

// SHOW - shows more info about one routine
router.get("/:id", (req, res) => {
    //find the routine with provided ID
    Routine.findById(req.params.id).populate("steps").exec((err, foundRoutine) => {
        if(err){
            console.log(err);
        } else {
            console.log(foundRoutine);
            // render show template with that routine
            res.render("routines/show", {routine: foundRoutine});
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
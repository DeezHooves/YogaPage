const express = require("express");
const Routine = require("../models/routine");
const router = express.Router();
const middleware = require("../middleware");


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
router.post("/", middleware.isLoggedIn, (req, res) => {
    // get data from form and add to routines array
    let poster = {
        id: req.user._id,
        username: req.user.username
    },
    name = req.body.name,
    image = req.body.image,
    author = req.body.author,
    style = req.body.style,
    level = req.body.level,
    length = req.body.length,
    accessories = req.body.accessories;
    newRoutine = {poster:poster, name: name, image: image, author:author, style:style, level:level, length:length, accessories:accessories};
    // Create a new routine and save to DB
    Routine.create(newRoutine, (err, newlyCreated) =>{
        if(err){
            console.log(err);
        } else {
            req.flash("success", "Added your new routine!");
            // redirect back to routines page.
            res.redirect("/routines");
        }
    });
});

// NEW - shows form to create new routine
router.get("/new", middleware.isLoggedIn, (req, res) => {
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

// EDIT ROUTINE ROUTE
router.get("/:id/edit", middleware.checkRoutineOwnership, (req, res) => {
    Routine.findById(req.params.id, (err, foundRoutine) => {
        res.render("routines/edit", {routine: foundRoutine});            
    });
});

// UPDATE ROUTINE ROUTE
router.put("/:id/", middleware.checkRoutineOwnership, (req, res) => {
    // find and update the correct routine
    console.log("===================");
    console.log(req.body);
    console.log("===================");
    Routine.findByIdAndUpdate(req.params.id, req.body.routine, (err, updatedRoutine) => {
        if(err){
            res.redirect("/routines");
        } else {
            console.log("==================");
            console.log(updatedRoutine);
            console.log("==================");
            req.flash("success", "Updated your routine");
            // redirect somewhere(show page)
            res.redirect("/routines/" + req.params.id);
        }
    });
});

// DESTROY ROUTINE ROUTE
router.delete("/:id", middleware.checkRoutineOwnership, (req, res) => {
    Routine.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/routines");
        } else {
            req.flash("success", "DESTROYED your routine");
            res.redirect("/routines");
        }
    })
});

module.exports = router;


//                 <!-- <%- document.getElementById("accessories").populate(routine.accessories); %> -->
const express = require("express");
const routine = require("../models/routine");
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
let postAuthor = {
        id: req.user._id,
        username: req.user.username
    },
    name = req.body.name,
    image = req.body.image,
    author = req.body.author,
    style = req.body.style,
    level = req.body.level,
    length = req.body.length,
    newRoutine = {postAuthor:postAuthor, name: name, image: image, author:author, style:style, level:level, length:length};
    console.log(req.user);
    console.log(postAuthor);
    console.log(newRoutine);
    // Create a new routine and save to DB
    Routine.create(newRoutine, (err, newlyCreated) =>{
        if(err){
            console.log(err);
        } else {
            // redirect back to routines page.
            res.redirect("/routines");
        }
    });
});

// NEW - shows form to create new routine
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

// EDIT ROUTINE ROUTE
router.get("/:id/edit", checkRoutineOwnership, (req, res) => {
    Routine.findById(req.params.id, (err, foundRoutine) => {
        res.render("routines/edit", {routine: foundRoutine});            
    });
});

// UPDATE ROUTINE ROUTE
router.put("/:id/", (req, res) => {
    // find and update the correct routine
    Routine.findByIdAndUpdate(req.params.id, req.body.routine, (err, updatedRoutine) => {
        if(err){
            res.redirect("/routines");
        } else {
            // redirect somewhere(show page)
            res.redirect("/routines/" + req.params.id);
        }
    });
});

// DESTROY ROUTINE ROUTE
router.delete("/:id", isLoggedIn, (req, res) => {
    Routine.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/routines");
        } else {
            res.redirect("/routines");
        }
    })
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkRoutineOwnership(req, res, next){
    if(req.isAuthenticated()){
        Routine.findById(req.params.id, (err, foundRoutine) => {
            if(err){
                res.redirect("back");
            } else {
                // does user own the routine
                if(foundRoutine.postAuthor.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;
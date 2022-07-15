const { application } = require("express");
const express = require("express");
const router = express.Router({mergeParams: true});

const Routine = require("../models/routine"),
      step    = require("../models/step");

//Steps new
router.get("/new", isLoggedIn, (req, res) => {
    // find routine by id
    Routine.findById(req.params.id, (err, routine) => {
        if(err){
            console.log(err);
        } else {
            res.render("steps/new", {routine: routine});
        }
    })
});

//Steps create
router.post("/", isLoggedIn, (req, res) => {
    // lookup routine using ID
    Routine.findById(req.params.id, (err, routine) => {
        if(err){
            console.log(err);
            res.redirect("/routines");
        } else {
            // create new step
            step.create(req.body.step, (err, step) => {
                if(err){
                    console.log(err);
                } else {
                    // save step
                    step.save();
                    // connect new step to routine
                    routine.steps.push(step);
                    routine.save();
                    // redirect routine show page
                    console.log(step);
                    res.redirect("/routines/" + routine._id);
                }
            });
        }
    });
});

// delete a step
router.get("/delete", isLoggedIn, (req, res) => {
    console.log("Delete stuff");

    // db.yoga.updateOne({},{"$unset":{"steps.*step id*"}}) //mongosh code to remove a comment
});


// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
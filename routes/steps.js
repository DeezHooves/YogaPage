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

// edit a step
router.get("/:step_id/edit", (req, res) => {
    step.findById(req.params.step_id, (err, foundStep) => {
        if(err){
            res.redirect("back");
        } else {
            res.render("steps/edit", {routine_id: req.params.id, step: foundStep});
        }
    });
});

// update a step
router.put("/:step_id", (req, res) => {
    step.findByIdAndUpdate(req.params.step_id, req.body.step, (err, updatedStep) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/routines/" + req.params.id);
        }
    });
});

// delete a step
router.delete("/:step_id", isLoggedIn, (req, res) => {
    step.findByIdAndRemove(req.params.step_id, (err) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/routines/" + req.params.id);
        }
    });
});


// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
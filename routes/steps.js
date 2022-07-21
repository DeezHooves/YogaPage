const { application } = require("express");
const express = require("express");
const router = express.Router({mergeParams: true});
const middleware = require("../middleware");

const Routine = require("../models/routine"),
      Step    = require("../models/step");

//Steps new
router.get("/new", middleware.isLoggedIn, (req, res) => {
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
router.post("/", middleware.isLoggedIn, (req, res) => {
    // lookup routine using ID
    Routine.findById(req.params.id, (err, routine) => {
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
            res.redirect("/routines");
        } else {
            // create new step
            Step.create(req.body.step, (err, step) => {
                if(err){
                    console.log(err);
                } else {
                    // add username and id to step
                    step.poster.id = req.user._id;
                    step.poster.username = req.user.username;
                    // save step
                    step.save();
                    // connect new step to routine
                    routine.steps.push(step);
                    routine.save();
                    // redirect routine show page
                    req.flash("success", "Successfully added a new step!")
                    res.redirect("/routines/" + routine._id);
                }
            });
        }
    });
});

// edit a step
router.get("/:step_id/edit", middleware.checkStepOwnership, (req, res) => {
    Step.findById(req.params.step_id, (err, foundStep) => {
        if(err){
            res.redirect("back");
        } else {
            res.render("steps/edit", {routine_id: req.params.id, step: foundStep});
        }
    });
});

// update a step
router.put("/:step_id", middleware.checkStepOwnership, (req, res) => {
    Step.findByIdAndUpdate(req.params.step_id, req.body.step, (err, updatedStep) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/routines/" + req.params.id);
        }
    });
});

// delete a step
router.delete("/:step_id", middleware.checkStepOwnership, (req, res) => {
    Step.findByIdAndRemove(req.params.step_id, (err) => {
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Step deleted!");
            res.redirect("/routines/" + req.params.id);
        }
    });
});


module.exports = router;
let Routine = require("../models/routine"),
    Step = require("../models/step"),
    middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

middlewareObj.checkRoutineOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Routine.findById(req.params.id, (err, foundRoutine) => {
            if(err){
                res.redirect("back");
            } else {
                // does user own the routine
                if(foundRoutine.poster.id.equals(req.user._id)){
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

middlewareObj.checkStepOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Step.findById(req.params.step_id, (err, foundStep) => {
            console.log("=======================");
            console.log(req.user);
            console.log("=======================");
            if(err){
                res.redirect("back");
            } else {
                // does user own the step
                if(foundStep.poster.id.equals(req.user._id)){
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

module.exports = middlewareObj;
let Routine = require("../models/routine"),
    Step = require("../models/step"),
    middlewareObj = {};
    
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

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect('/login');
}

module.exports = middlewareObj;
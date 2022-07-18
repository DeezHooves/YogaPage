let Routine = require("../models/routine"),
    Step = require("../models/step"),
    middlewareObj = {};
    
middlewareObj.checkRoutineOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Routine.findById(req.params.id, (err, foundRoutine) => {
            if(err){
                req.flash("error", "Routine not found")
                res.redirect("back");
            } else {
                // does user own the routine
                if(foundRoutine.poster.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
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
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect('/login');
}

module.exports = middlewareObj;
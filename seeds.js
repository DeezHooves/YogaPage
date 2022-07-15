const mongoose = require("mongoose"),
      Routine  = require("./models/routine"),
      Step     = require("./models/step");

function seedDB(){
    // remove all routines
    Routine.remove({}, (err) => {
        if(err){
            console.log(err);
        }
        console.log("Removed routines!");
        // add a few routines
        data.forEach((seed) => {
            Routine.create(seed, (err, routine) => {
                if(err){
                    console.log(err);
                } else {
                    console.log("Added a routine");
                    // add a step
                    Step.create(
                        {
                            // image: "https://i.ibb.co/9yGHTDf/Stretchable-Flexible-step-1.jpg",
                            // text:"downward dog"
                        }, (err, step) => {
                            if(err){
                                console.log(err);
                            } else {
                                routine.steps.push(step);
                                routine.save();
                                console.log("added a new step");
                            };
                        });
                }
            });
        });
    });
    // add a few comments
};

module.exports = seedDB;
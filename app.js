const express       = require("express"),
      app           = express(),
      path          = require('path'),
      seedDB        = require("./seeds"),
      mongoose      = require('mongoose'),
      passport      = require('passport'),
      bodyParser    = require("body-parser"),
      step          = require("./models/step"),
      User          = require("./models/user"),
      LocalStrategy = require("passport-local"),
      Routine       = require("./models/routine"),
      ObjectID      = require('mongodb').ObjectID;

// requiring routes
const indexRoutes   = require("./routes/index"),
      routineRoutes = require("./routes/routines"),
      stepRoutes    = require("./routes/steps");

// connect to database
mongoose.connect('mongodb://localhost:27017/yoga', 
{useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

// seedDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "2s never lose",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});


// reenable this if it has trouble reading views
// app.set('views', path.join(__dirname, 'views'));

app.use("/", indexRoutes);
app.use("/routines", routineRoutes);
app.use("/routines/:id/steps", stepRoutes);

app.listen(3001, () => {
    console.log("The server has started!");
});
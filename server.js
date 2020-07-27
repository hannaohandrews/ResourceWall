// load .env data into process.env
require('dotenv').config({silent: true});

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const cookieSession = require('cookie-session');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const resourcesRoutes = require("./routes/resources.js");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/users", usersRoutes(db));
app.use("/widgets", widgetsRoutes(db));
app.use("/resources", resourcesRoutes(db));


// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


//CJ updated to render login page or main logged in page
app.get("/", (req, res) => {
  // if (!req.session.user_id) {
  //   res.redirect("/register");
  // } else {
    res.render("1_homepage_nl");
});

app.get('/login', (req, res) => {
  res.render("3_login");
});
// demo - just login as one person


app.get('/login/:id', (req, res) => {
  req.session.user_id = req.params.id;
  res.redirect('/');
});


// registration page
app.get("/register", (req, res) => {
  // if (req.session) {
  //   res.redirect("/home_logged_in");
  // } else {
    res.render("2_register");
});



// Direct to logged in home page
app.get ("/home_logged_in", (req, res) => {
  // if (!req.session.user_id) {
  //   res.redirect("/home_login_register");
  // } else {
    res.render("4_homepage_logged");
  // }
});

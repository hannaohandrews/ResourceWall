/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {


  // direct to resource page
  router.get("/:id", (req, res) => {

    // get the id
    const id = req.params.id;

    if (!req.session.user_id) {
      res.redirect("/home_login_register");
    } else {

      // data
      // do sql here

      const query = {
        type: `SELECT * FROM resources WHERE id = $1`,
        values: [id]
      };

      db
        .query(query)
        .then(result => {

          const templateVars = {
            resource: result.rows[0]
          }

          res.render("resource_url", templateVars);

        })
        .catch(err => console.log(err))


    }
  });

  // direct to add new resource page(will need page name checking)
  router.get("/new", (req, res) => {
    // display the form to create a new resource
    if (!req.session.user_id) {
      res.redirect("/home_login_register");
    } else {
      res.render("resource_new");
    }
  });



  return router;
};

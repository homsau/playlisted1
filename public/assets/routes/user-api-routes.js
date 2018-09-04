///////////////////////////////////////////////////////////////////////////////////////////////////
// File Name: user-api-routes.js 
//
// Description: This file offers a set of routes for displaying and saving user data to the db
///////////////////////////////////////////////////////////////////////////////////////////////////

// Requiring our models
var db = require("./../../../models");
// const { check, validationResult } = require('express-validator/check');

/////////////////
// Routes
/////////////////
module.exports = function(app) {

/*
  ///////////////////////////////////////////////////////
  // GET route for authenticating users (passport-spotify)
  ///////////////////////////////////////////////////////
  
  //Spotify auth route with scopes, currently returning 
  //user's Spotify email and private info
  //
  $("#spotifyLoginBtn").on("click", function() {
    app.get('/api/users/spotify', passport.authenticate('spotify', {
      scope: ['user-read-email', 'user-read-private'],
      //force login dialog 
      showDialog: true
    }),
    function(req, res) {
      // The request will be redirected to spotify for authentication, so this
      // function will not be called.
    }
  );

  app.get(
    '/api/users/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );
  });
  
*/
  


  /////////////////////////////////////////////
  // GET route for getting ALL of the users
  /////////////////////////////////////////////
  app.get("/api/users", function(req, res) {
    var query = {};

    console.log("route: all users");
    console.log(JSON.stringify(req.body));

    // if (req.query.user_id) {
    //   query.user_id = req.query.user_id;
    // };

    db.Users.findAll({
      where: query
    }).then(function(dbResult) {
      // res.json(dbResult);          // send as json

      // send to handlebars
      var hbsObject = {
        users: dbResult
      };
      res.render("users", hbsObject);
    });
  });

  //////////////////////////   AUTH   ///////////////////////////////////////////////////////////////

  /////////////////////////////////////////////
  // GET route to LOGIN a user
  /////////////////////////////////////////////
  app.post("/api/users/login", function(req, res) {
    var query = {};
    var password = req.body.user_password;

    console.log("route: login user");
    console.log(JSON.stringify(req.body));

    if (req.query.user_name) {
      query.user_name = req.query.user_name;
    } else {
      query.user_name = req.body.user_name;
    };

    db.Users.findOne({
      where: query
    }).then(async function(dbResult) {
      // res.json(dbResult);          // send as json

      if (!dbResult) {
        res.redirect('/login');
      } else if (!await dbResult.validPassword(password)) {
        res.redirect('/login');
      } else {
        req.session.user = dbResult;
        res.redirect('/');
      }
    });
    
      // send to handlebars
    //   var hbsUser = {
    //     user: dbResult
    //   };
    //   // console.log(dbResult);
    //   res.render("users", hbsUser);
    // });
  });

  //////////////////////////   AUTH end   ///////////////////////////////////////////////////////////////

  /////////////////////////////////////////////
  // GET route for retrieving ONE user
  /////////////////////////////////////////////
  app.get("/api/users/:id", function(req, res) {

    console.log("route: specific user");
    console.log(JSON.stringify(req.body));

    db.Users.findAll({
      where: {
        user_id: req.params.id
      }
    }).then(function(dbResult) {
      // res.json(dbResult);          // send as json

      // send to handlebars
      var hbsUser = {
        user: dbResult
      };
      // console.log(dbResult);
      res.render("users", hbsUser);
    });
  });

  /////////////////////////////////////////////
  // POST route for CREATE a new user
  /////////////////////////////////////////////
  app.post("/api/users", 
  // [
  //     check('user_name').isLength({ min: 1, max: 50}),
  //     check('user_email').isEmail(),
  //     check('user_password').isLength({ min: 5 })
  //   ],  
    function(req, res) {

    console.log("route: create user");
    console.log(JSON.stringify(req.body));

    // Finds the validation errors in this request and wraps them in an object with handy functions
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   console.log(errors);
    //   return res.status(422).json({ errors: errors.array() });
    // }
    
    // call the model to create the user
    db.Users.create(req.body).then(function(dbResult) {
      console.log("User created.");

      res.json(dbResult);          // send as json
    });
  });

  /////////////////////////////////////////////
  // DELETE route for deleting a user
  /////////////////////////////////////////////
  app.delete("/api/users/:id", function(req, res) {
    
    console.log("route: delete a user");
    console.log(JSON.stringify(req.body));
    
    db.Users.destroy({
      where: {
        user_id: req.params.id        //req.body.id if send in body
      }
    }).then(function(dbResult) {
      console.log("after the deletion of user");

      res.json(dbResult);          // send as json
    });
  });

  /////////////////////////////////////////////
  // PUT route for UPDATE
  /////////////////////////////////////////////
  app.put("/api/users/:id", function(req, res) {

    console.log("route: update user");
    console.log(JSON.stringify(req.body));

    var id = (req.params.id) ? req.params.id : req.body.id;

    db.Users.update(
      req.body,
      {
        where: {
          user_id: id
        },
        individualHooks: true
      }).then(function(dbResult) {
        res.json(dbResult);
    });

  });
};

const router = require("express").Router();

const Users = require("./users-model.js");

const restricted = require('../auth/restricted-middleware.js');
const checkRole = require('../auth/check-role-middleware.js');



//path /users/

router.get("/", restricted, (req, res) => {
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

  router.get("/pt11/", restricted, checkRole('PT11'), (req, res) => {
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

  router.get("/:id", restricted, (req, res) => {
    const { id } = req.params;
    
    Users.findById(id)
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

 

  
  module.exports = router;



  //----------------------------------------------------------------------------//
// Note that a call to GET /api/users is protected by our "restricted"
// middleware. That middleware is set up globally in the server.js file. We
// don't have to do anything here, because a request for GET /api/users will
// first be handled by the restricted middleware, which checks to see if a
// req.session.user object exists. If it does, processing is allowed to
// continue, so if we ever reach this request handler, it's because the
// restricted middleware determined that the session exists, is not expired, and
// has the .user object (which can only be added by a successful login.)
//----------------------------------------------------------------------------//
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const restricted = require('../auth/restricted-middleware.js');

// express routers
const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/auth-router.js");

//server object
const server = express();

//----------------------------------------------------------------------------//
// create the config object for express-session. This will be passed to
// "session" when it is set up as global middleware, below.
//
// Most of these options have to do with how the cookies are managed, and how
// session data is stored.
//
// see express-session documentation at npmjs.org for info on these and other
// options.
//
// note that the options under "store:" are for connect-session-knex. You can
// read about them under that module at npmjs.org.
//----------------------------------------------------------------------------//
const sessionConfig = {
  name: 'my-cookie',
  secret: 'mysecret',
  cookie: {
    maxAge: 3600 * 1000,
    secure: false, // should be true in production
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,

  store: new knexSessionStore(
    {
      knex: require("../data/dbConfig"),
      tablename: "sessions",
      sidfieldname: "sid",
      createtable: true,
      clearInterval: 3600 * 1000
    }
  )
}

// global middleware
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session(sessionConfig));

server.use("/api/users", restricted, usersRouter);
server.use("/api/auth", authRouter);


server.get("/", (req, res) => {
  res.json({ api: "up" });
});


module.exports = server;
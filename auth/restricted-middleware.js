//----------------------------------------------------------------------------//
// In this exported middleware, we simply check to see if req.session.user
// exists. We don't need to check for req.session, because we have added the
// express-session middleware as global middleware. This means that every
// request will have a "session" object on the req object. 
// 
// Our login handler adds a "user" property to req.session if the user
// successfully logs in. We could add anything at all. The session object can
// include minimal information (like we do here), or it can include other
// session-specific information. 
// 
// Here, we just check to see if .user exists. 
//----------------------------------------------------------------------------//

const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (token) {
            jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
              if (err) {
                res.status(401).json({ you: "can't touch this" });
              } else {
                req.decodedJwt = decodedToken;
                console.log(req.decodedJwt);
                next();
              }
            })
          } else {
            throw new Error('invalid auth data');
          }
        } catch (err) {
          res.status(401).json({ error: err.message });
        }

    };


    // if (req.session && req.session.user) {
    //     next();
    // } else {
    //     res.status(401).json({ message: 'not logged in' });
    // }
    // 
const jwt = require("jsonwebtoken");
const key = "jassi"
function isLoggedIn(req, res, next) {

  if (req.user) {
    req.email = req.user.email
    next()
  } else {
    try {
      let token = req.params.token || req.header.token || req.cookies.token;
      if (token) {
        let user = jwt.verify(token, key);
        if (user) {
          req.name = user.number;
          req.email = user.email;
          next();
        }
        else {
          res.status(500).send({ msg: "not_autherrised" })
        }
      } else {
        res.status(500).send({ msg: "not autherrised" })
      }

    } catch (err) {
      console.log(err);
      res.status(500);
      res.send({ msg: "something went wrong" });
    }
  }

}

module.exports = isLoggedIn;
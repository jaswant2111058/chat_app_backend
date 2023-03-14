const express = require("express");
const router = express.Router();
const passport = require('passport');
const schema = require("../model/user")
const session = require('express-session');
const cookie = require("cookie-parser");
const bodyParser = require("body-parser")
router.use(cookie());
router.use(bodyParser.urlencoded({ extended: true }));
const jwt = require("jsonwebtoken");
//const isLoggedIn = require("../middleware/middleware")
require("../middleware/auth")
router.use(session({ secret: "jassi", resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());
const time = 1000 * 15 * 60;

function isLoggedIn(req, res, next) {
  req.user ? next() : res.redirect("https://chat-app-tweeto.onrender.com/");
}


router.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }
  ));


router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/redirecting',
    failureRedirect: '/google/failure'
  })
);

router.get('/redirecting', (req, res) => {

  res.redirect('https://chat-app-tweeto.onrender.com')
})

router.post("/googlelogin",async (req, res) => {
  const email = req.user.email;
  const semail = await schema.findOne({ email: email })
  if (!semail) {
    try {
      const detail = { name: req.user.displayName, email: req.user.email, email_status: true, type: false }
      const usr = new schema(detail);
      await usr.save();
      const token = jwt.sign({ email: detail.email, name: detail.name }, process.env.SESSION_SECRET)
      res.header("token", token, {
        expires: new Date(Date.now() + time),
        httpOnly: true
      })
      res.cookie("token", token, {
        expires: new Date(Date.now() + time),
        httpOnly: true
      })
      console.log(token);
      res.send({
        msg: `user logged in`, user: {
          email: detail.email,
          name: detail.name,
          type: detail.type,
          token: token,
          expires_in: new Date(Date.now() + time),
        }
      })
      // res.redirect("/check")
    }
    catch (error) {
      res.status(400).send(error);
    }
  }
  else {
    try{
    const token = jwt.sign({ email: semail.email, number: semail.number }, process.env.SESSION_SECRET)
    res.header("token", token, {
      expires: new Date(Date.now() + time),
      httpOnly: true
    })
    res.cookie("token", token, {
      expires: new Date(Date.now() + time),
      httpOnly: true
    })
    console.log(token);
    res.send({
      msg: `user logged in`, user: {
        email: email,
        name: semail.name,
        type: semail.type,
        token: token,
        expires_in: new Date(Date.now() + time),
      }
    })
    }
    catch(err){
      res.status(400).send(err);
    }
  }
})




router.get('/logout',async (req,res)=>{
  try{
 req.user=null;
 req.logout(function(err) {
  if (err) { return next(err); }
  res.send({msg:'logout success'})
});
  console.log('logout')
 }
 catch(err){
   console.log(err)
   res.send(err).status(400)
 }
})



router.get('/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});



module.exports = router;

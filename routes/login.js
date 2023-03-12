const express = require("express");
const router = express.Router();
const schema = require("../model/user")
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
const cookie = require("cookie-parser");
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken");
const key = process.env.SESSION_SECRET;
const time = 1000 * 15 * 60;
router.use(cookie());
router.use(bodyParser.urlencoded({ extended: true }));
const sendmail = require("../nodemailer/mailer");
const bcrypt = require("bcrypt");


//signup post

router.post('/signup', async (req, res) => {

  try {
    const { email, password } = req.body;
    const preEmail = await schema.findOne({ email: email })

    bcrypt.hash(password, 12, async function (err, hash) {
      if (!preEmail) {
        const otp = sendmail(email);
        const detail = { email: email, password: hash, name: req.body.username, email_status: false, otp: otp }
        const usr = new schema(detail)
        const keetp = await usr.save();
        console.log(otp, keetp)
        res.send({ msg: "otp has sent" })
      }
      else if (preEmail.email_status === false) {
        const otp = sendmail(email);
        await schema.updateOne({ email: email }, { password: hash, name: req.body.username, email_status: false, otp: otp })
        res.send({ msg: "otp has sent" })
      }
      else {
        res.send({ msg: `user with ${email} has already register login with diffrent one` })
      }
    })


  }

  catch (e) {
    console.log(e)
    res.status(400).send({ msg: "email is all ready register" });
  }

})


//otp verification


router.post("/otpverification", async (req, res) => {

  try {
    let otp = await schema.findOne({ email: req.body.email })
    if (otp.otp == req.body.otp) {
      await schema.updateOne({ email: req.body.email }, { email_status: true, otp: null });
      res.send({ msg: "otp verified" })
    }
    else {
      res.send({ msg: "otp is not matching" })

    }
  }
  catch (e) {
    console.log(e)
    res.status(400).send({ msg: "something went wrong" });
  }
})


//login post

router.post("/login", async (req, res) => {

  try {
    const { email, password } = req.body
    const semail = await schema.findOne({ email: email })
    if (semail && semail.email_status === true) {
      bcrypt.compare(password, semail.password, function (err, responce) {
        if (err) {
          res.send({ msg: "kuchh error hai bro" })
        }
        else if (!responce) {

          res.send({ msg: "password not match" });
        }
        else {
          const token = jwt.sign({ email: semail.email, number: semail.number }, key)
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

      })

    }
    else

      res.send({ msg: false })
  }

  catch (e) {
    console.log(e).
      res.status(400).send(e);
  }
})


//forget password get



// forget password post

router.post("/forgetpassword", async (req, res) => {
  try {
    const email = await schema.findOne({ email: req.body.email })
    if (!email) {
      res.send({ msg: "Email is not register" })
    }
    else {
      const otp = sendmail(req.body.email);
      await schema.updateOne({ email: req.body.email }, { otp: otp })

      res.send({ msg: "otp send to " + req.body.email })
    }
  }
  catch {
    res.status(400).send(e);
  }
})

//forget password otp verification

router.post("/fov", async (req, res) => {

  try {
    const pass = req.body.password;
    const otp = schema.findOne({ email: req.body.email })
    if (otp.otp == req.body.otp) {

      bcrypt.hash(pass, 12, async function (err, hash) {
        await schema.updateOne({ email: req.body.email }, { password: hash, otp: null });
      })

      res.send({ msg: "password changed" })
    }
    else {
      res.send({ msg: "otp is not matching" })
    }
  }
  catch {
    res.status(400).send(e);
  }
})

module.exports = router;

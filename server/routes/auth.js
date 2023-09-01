const router = require("express").Router();
const transporter = require("../middlewares/utils");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
const {
  usernameToLowerCase,
  messages,
  ensureLoggedin,
  ensureGuest,
} = require("../middlewares/misce");


// create user.
router.post("/register", ensureLoggedin, async (req, res) => {
  let { username, email, password } = req.body;
  username = username.toLowerCase().trim();
  email = email.toLowerCase().trim();

  // Validate fields
  let errors = [];
  if (!username || !password || !email) {
    return res.redirect("/secure/register");
  }

  if (username.length < 4 && username != "") {
    errors.push({ msg: "Username is too Short" });
  }

  //  check for password Length
  if (password.length < 6 && username != "" && !username.length < 4) {
    errors.push({ msg: "Password too easy" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      username,
      email,
      password,
    });
  } else {
    try {
      const userExists = await User.findOne({ email: email });
      if (userExists) {
        req.flash("error_msg", "Account Already Exists");
        return res.redirect("/secure/register");
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.create({
          username,
          email,
          password: hashedPassword,
        });

        req.flash("success_msg", "Registration successful, Please Login");
        res.redirect("/secure/login");
      }
    } catch (error) {
      console.log(error);
    }
  }
});

// pages
router.get("/login", ensureGuest, (req, res) => {
  res.render("login");
});
router.get("/register", ensureLoggedin, (req, res) => {
  res.render("register");
});


router.get("/email", (req, res)=>{
  res.redirect(`https://vm789.tmdcloud.eu:2096/`);
  return
})

// Method POST
router.post("/login", usernameToLowerCase, (req, res, next) => {
  let { username, password } = req.body;

  if (username == "" && password == "") {
    return res.redirect("/secure/login");
  } else if (!username || !password) {
    res.render("login", {
      username,
      password,
      error_msg: "Fill all empty fields",
    });
  } else {
    passport.authenticate("local", { session: true }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("error", info.message);
        return res.redirect("/secure/login");
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        } else {
          res.redirect("/d");
        }
      });
    })(req, res, next);
  }
});

// logout Handler
router.get("/logout", async (req, res) => {
  // req.session.destroy();
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//  Send Contact Message to Email

router.post("/message", async (req, res) => {
  let { name, email, subject, message } = req.body;


  if (name == "" && email == "" && subject == "" && message == "") {
    return res.send("Empty form not allowed");
  }

  if (!name || !email || !subject || !message) {
    return res.send("Fill all inputs");
  }
  
  const mailOptions = {
    from: '"Allroundcargo"<info@allroundcargo.org>',
    to: "ernestez12@gmail.com, info@allroundcargo.org",
    subject: "You have received a message from Allroundcargo contact form",
    html: messages(name, email, subject, message),
  };
    await transporter.sendMail(mailOptions, (err, data)=>{

    if(err){
     return console.log(err)
    }
    res.send("Message Sent");
  });

});

module.exports = router;

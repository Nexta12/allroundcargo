
module.exports = {
  ensureLoggedin: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error", "Restricted, Please Login");
      return res.redirect("/secure/login");
    }
  },
  ensureGuest: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/d");
    }
  },
  usernameToLowerCase: (req, res, next) => {
    if (req.body.username) {
      req.body.username = req.body.username.toLowerCase();
    }
    next();
  },

  messages: (name, email, subject, message)=>{
    return `
    <p> You have a new message from Contact form </p>
    <h3>Contact Details</h3>
    <ul>
        <li> Name: ${name} </li>
        <li> Email: ${email} </li>
        <li> Company: ${subject} </li>
       
    </ul>
    <h3>Message</h3>
    <p>${message}</p> `;
  }
};
const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")










// get all users
router.get("/", async (req, res) => {
   const subscribers = await User.find({role: "Customer"})
    res.render("subscribers", {
      title: "Subscribers List",
      layout: "../layouts/dashLayout",
      subscribers,
    });
});

// create a user
router.get("/add_new", (req, res)=>{ 
    res.render("add_new", {
        title: "+New User",
        layout: "../layouts/dashLayout"
    })
})

router.post("/add_new", async (req, res)=>{
  
  try {

    const { username, firstname , lastname, email, phone, password } = req.body;
    
    // validations
    if(username = "" || firstname == "" || email == "" || password == ""){
       res
      .status(400)
      .json({ status: "Failed", message: "Provide all Input fields" });
    }else if (!/^[a-zA-Z ]*$/.test(firstname)) {
       res
         .status(400)
         .json({ status: "Failed", message: "Invalid First Name" });
    }else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {

       res
         .status(400)
         .json({ status: "Failed", message: "Invalid Email detected" });
    }else if(password.length < 6){
       res
         .status(400)
         .json({ status: "Failed", message: "Password Must be upto 6 Characters" });
    }else{

      // all cleared, check if user already exists
      const user = await User.findOne({email})
      if(user.length > 0 ){
         res
           .status(400)
           .json({
             status: "Failed",
             message: "Account Already Exists",
           });
      }else{
        // create a new user
        // handle password
         const hashedPassword = await bcrypt.hash(password, 10)
         const newUser = new User({
           username,
           firstname,
           lastname,
           email,
           phone,
           password: hashedPassword
         });
         await newUser.save()
      }
    }
    
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }


})

// view one user
router.get("/:id",async (req, res) => {
  const user = await User.findById(req.params.id)
  res.render("single_user", {
    title: user.email,
    layout: "../layouts/dashLayout",
    user,
  });
});


// edit a user
router.get("/edit/:id", (req, res)=>{
    res.render("edit_user",{
        title: "Edit user",
        layout: "../layouts/dashLayout"
    })
})

// delete a user
router.get("/delete/:id",async (req, res) => {
   const userDelete = await User.findByIdAndDelete(req.params.id)
   res.redirect("/api/users")
});


module.exports = router;

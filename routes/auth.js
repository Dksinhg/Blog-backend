// <-------Authications ----------->

const router = require("express").Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");

// middleware
const bodyparser = require("body-parser");
router.use(bodyparser.urlencoded({ extended: false }));
router.use(bodyparser.json());


router.get("/demo", (req, resp) => {
  resp.send("hello world");
});

// register
router.post("/register", async (req, resp) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const bcryptPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcryptPassword,
    });

    const user = await newUser.save();
    console.log(user);
    resp.status(200).json(user);
  } catch (error) {
    console.log("error");
    resp.status(200).json(error);
  }
});

// Login

router.post("/login", async (req, resp) => {
    try {
     const user = await User.findOne({name: req.body.name})

    //  if no user  
     !user && resp.status(400).json("not user !")
     
    //  if same user then compare password
     const validatPassword = await bcrypt.compare(req.body.password, user.password)
    
    //  if not validate 
     !validatPassword && resp.status(400).json("wrong password !")
   
     const {password, ...other} = user._doc
     resp.status(200).json(other)

   } catch (error) {
    console.log("error")
   }
});

module.exports = router;
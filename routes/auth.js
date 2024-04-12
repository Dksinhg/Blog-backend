// <-------Authications ----------->

const router = require("express").Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

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
       req.user = null;
     
      const token = req.headers=['token']
      if (token) {
        const  verifyUser = jwt.verify(token, process.env.DK);
        if(verifyUser){
          const user = await User.findOne({_id: verifyUser.id})
          if (user) {
            req.user = user;
            req.token = token;
          }
        }
      }
    } catch (error){
      req.user = null;
      console.log(error)
    }
   
  //   try {
  //   //  const user = await User.findOne({name: req.body.name})
  //    const user = await User.findOne({name: req.body.name})

  //   //  if no user  
  //    !user && resp.status(400).json("not user !")
     
  //   //  if same user then compare password
  //    const validatPassword = await bcrypt.compare(req.body.password, user.password)
    
  //   //  if not validate 
  //    !validatPassword && resp.status(400).json("wrong password !")
   
  //    const {password, ...other} = user._doc
  //    resp.status(200).json(other)

  //  } catch (error) {
  //   console.log("error")
  //  }
});

module.exports = router;
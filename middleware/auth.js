// import User from "../model/user";
const User = require('../model/user')
const jwt = require('jsonwebtoken');

const auth = async(req, resp, next)=>{
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
     next()
}

module.export = auth;

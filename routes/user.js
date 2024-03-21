const router = require("express").Router()
const User = require("../model/user")
const Post = require("../model/post")
const bcrypt = require("bcrypt")


// update 
router.put("/update/:id", async(req, resp)=>{
  
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }

        try {
         const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set :req.body,
            },
            {
                new:true,  // This is just for postman
            }
         )       
         console.log(updateUser)
         resp.status(200).json(updateUser)
        } catch (error) {
            resp.status(500).json(error)
            console.log("error")
        }
    }else{
        resp.status(401).json("You can update your account")
        console.log("error")
    }

})


// delete
router.delete("/:id", async(req, resp)=>{
    // userId is userdefine 
    if (req.body.userId === req.params.id) {
        try {
             const user = await User.findById(req.params.id)
             try {
                await Post.deleteMany({name: user.name})
            
                // only delete user account

                await User.findByIdAndDelete(req.params.id)
                resp.status(200).json("user has been deleted....")
             } catch (error) {
                resp.status(500).json("error")
                console.log("error")
             }
        } catch (error) {
               resp.status(404).json("user not found...")
               console.log("error")
        }
    } else {
        resp.status(401).json(" You can delete only your account..")
    }
})

// get user 
router.get("/get/:id", async(req, resp)=>{
    try {
        const user = await User.findById(req.params.id)
        const {password, ...other} = user._doc
        resp.status(200).json(other)
    } catch (error) {
        resp.status(400).json("not found")
    }
})

module.exports = router;
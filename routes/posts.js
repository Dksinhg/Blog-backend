const router = require("express").Router()
const Post = require("../model/post");

// create Post
router.post("/dataPost", async(req, resp)=>{
    const newPost = new Post(req.body);

    try {
        const savePost = await newPost.save();
        console.log(savePost)
        resp.status(200).json(savePost)
    } catch (error) {
     resp.status(500).json(error)   
    }
})

// update Post 
router.put("/updatepost/:id", async(req, resp)=>{
       try {
        const post = await Post.findById(req.params.id);
        if (post.name === req.body.name) {
            try {
                const updatePost = await Post.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: req.body,
                    },
                    {
                        new: true,
                    }
                )
                console.log(updatePost)
                resp.status(200).json(updatePost)
            } catch (error) {
                resp.status(500).json(error)
            }
        } else{
            resp.status(401).json("You can update only your post !")
        }
       } catch (error) {
          resp.status(500).json(error)
       }
})


// delete Post

router.delete("/deletepost/:id", async(req, resp)=>{
      try {
        const newpost = await Post.findById(req.params.id);
        console.log(newpost)
        if (newpost.name === req.body.name) {
           try {
            await newpost.deleteOne();
            resp.status(201).json("post has been deleted")
           } catch (error) {
            resp.status(501).json("error")
           }

        } else {
            resp.status(401).json("You can delete only your post !")
        }
      } catch (error) {
        resp.status(501).json("error")
      }
})

// get post
router.get("/getpost/:id", async(req, resp)=>{
    
     try {
        const post = await Post.findById(req.params.id)
        console.log(post)
        resp.status(200).json(post)
        
    } catch (error) {
        resp.status(404).json("not found")
    }
})
// get all post
router.get("/getAlldata", async(req, resp)=>{
    const name = req.query.user
    const catName = req.query.cat

    try {
    let posts;
    if (name) {
        posts =await Post.find({name:name})
    }else if (catName) {
        posts = await Post.find({
        categories:{
            $in: [catName],
        },
        })
    } else {
        posts = await Post.find()
    }
    resp.send(posts)
    resp.status(200).json(posts) 
    } catch (error) {
        resp.status(404).json("error found")
    }
})

module.exports = router;
const router = require("express").Router()
const Category = require("../model/category")

//Create data 
router.post("/postCate", async(req, resp)=>{
    const newCategory = new Category(req.body);
    try {
       const saveCate = await newCategory.save();
       console.log(saveCate)
       resp.status(200).json(saveCate)
    } catch (error) {
        resp.status(501).json("error")
    }
})

// get all data
router.get("/getCate", async(req, resp)=>{
    try {
        const allCategory = await Category.find();
        // console.log(allCategory)
        resp.status(200).json(allCategory);
    } catch (error) {
        resp.status(501).json("error")
    }
})



module.exports= router;
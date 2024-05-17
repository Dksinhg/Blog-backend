const express = require('express');
const server = express();
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const authRoute = require("./routes/auth")
const authUser = require("./routes/user")
const authPost = require("./routes/posts")
const authCategries = require("./routes/categories");
const multer = require('multer');
const path = require("path")
const PORT = process.env.PORT || 4400

// use the configure .env packaages
dotenv.config()
//parse application/json
server.use(express.json())

// images
server.use("/images", express.static(path.join(__dirname, "/images")))


//<------ connect with mongoDB atlas -------------->
mongoose.connect(process.env.CONNECTION_URL,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
.then(console.log("Connected to mogoDB Atlas"))
.catch((error) => console.log(error))

// <-------- connect with local MongoDB  -------------->
// mongoose.connect(process.env.CONNECTED_URL,{
//    useNewUrlParser: true, 
//     useUnifiedTopology: true,
//     family: 4
// })
// .then(db => console.log('connect to MongoDB-Local'))
// .catch(err => console.log('err'))


const storage = multer.diskStorage({
    destination : (req, file, callb) =>{
        callb(null, "images")
    },
    filename: (req, file, callb)=>{
        callb(null, "file.png")
        // callb(null, req.body.name)
    }
})
const upload = multer({storage: storage})

server.post("/upload", upload.single("file"),(req, resp)=>{
    resp.status(200).json("file has been uploaded")
}) 

server.get("/", (req, resp)=>{
    resp.send(" hello Dinesh, Are production is running ")
})

// post the data regsiter and Login
server.use("/auth", authRoute);
// update and details userdetails
server.use("/user", authUser);
// Post the data
server.use("/posts", authPost);
// Post the Categoroy
server.use("/category", authCategries);

server.listen(PORT, ()=>{
    console.log("Port on 4400")
});
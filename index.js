const express = require("express");
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const multer = require("multer")
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const PORT = process.env.PORT || 8000

const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
const commentRoute = require("./routes/comments")
const likeRoute = require("./routes/likes")
const userRoute = require("./routes/users")
const relationRoute = require("./routes/relations")
const storiesRoute = require("./routes/stories")

// configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// configure Multer middleware
const upload = multer({ dest: "uploads/" });

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true)
    next()
})
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: true,
    optionsSuccessStatus: 200,
}))
app.use(cookieParser())
 
app.post('/api/upload', upload.single("file"), async(req, res) => {
    try {
        const rslt = await cloudinary.uploader.upload(req.file.path)
        res.status(200).json(rslt.secure_url)
    } catch (error) {
        res.status(500).json(error);
    }
})

app.use('/api/auth', authRoute)
app.use('/api/post', postRoute)
app.use('/api/comment', commentRoute)
app.use('/api/like', likeRoute)
app.use('/api/user', userRoute)
app.use('/api/relation', relationRoute)
app.use('/api/stories', storiesRoute)

app.listen(PORT, ()=>{
    console.log("server running on ", PORT);
})
const jwt = require("jsonwebtoken");
const db = require("../connect");
const moment = require("moment");

const getPosts = (req, res) => {

    const userId = req.query.userId

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Logged in!")

    jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {

        if(err) return res.status(403).json("TOken is not valid")

        const q = userId != "undefined"
                ?  `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY createdAt DESC`
                : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
                    LEFT JOIN relationship AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ?
                    ORDER BY p.createdAt DESC`
         
        const values = userId != "undefined" ? [userId] : [userInfo.id]         
        db.query(q, values, (err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json(data)
        }) 
    })    
}

const addPost = (req, res) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(401).json("Not Logged in!")

    jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
        if(err) return res.status(403).json("TOken is not valid")

        const q = "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)"

        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id
        ]

        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json("post added successfully")
        })

    })
}

const deletePost = (req, res) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(401).json("Not Logged in!")

    jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
        if(err) return res.status(403).json("TOken is not valid")

        const q = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?"

        db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if(err) return res.status(500).json(err)
            if(data.affectedRows > 0) return res.status(200).json("DELETED !!")
            return res.status(403).json("Only Your Account can DELETE !!")
        })
    })
}

module.exports = {getPosts, addPost, deletePost}
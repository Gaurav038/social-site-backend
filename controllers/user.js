const db = require("../connect")
const jwt = require("jsonwebtoken")

const getUser = (req, res) => {
    const userId = req.params.userId
    const q = "SELECT * FROM users WHERE id = ?"

    db.query(q, [userId], (err, data) => {
        if(err) return res.status(500).json(err)
        const {password, ...other} = data[0]
        return res.json(other)
    })
}

const getAllUser = (req, res) => {
    const userId = req.params.userId
    const q = "SELECT * FROM users WHERE id <> ?"

    db.query(q, [userId], (err, data) => {
        if(err) return res.status(500).json(err)
        return res.json(data)
    })
}



const updateUser = (req, res) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(401).json("Not Logged in!")

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if(err) return res.status(403).json("TOken is not valid")

        const q = "UPDATE users SET `name` = ?, `email` = ?, `about` = ?, `city` = ?, `profilePic` = ?, `coverPic` = ? WHERE id = ?"
        
        db.query(q, [
            req.body.name,
            req.body.email,
            req.body.about,
            req.body.city,
            req.body.profilePic,
            req.body.coverPic,
            userInfo.id
        ], 
        (err, data) => {
            if(err) return res.status(500).json(err)
            if(data.affectedRows > 0) return res.status(200).json("Updated !!")
            return res.status(403).json("Only Your Account can Update !!")
        })
    
    })
}

module.exports = {getUser, getAllUser , updateUser}
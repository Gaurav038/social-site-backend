const jwt = require("jsonwebtoken");
const db = require("../connect");

const getStories = (req, res) => {

    const token = req.cookies.accessToken
    if(!token) return res.status(401).json("Not Logged in!")

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if(err) return res.status(403).json("TOken is not valid")
        
      const q = `SELECT s.*, name FROM stories AS s JOIN users AS u ON (u.id = s.userId) LIMIT 4 `;

        db.query(q, [userInfo.id], (err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json(data)
        })      
    
    })
}

const addStories = (req, res) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(401).json("Not Logged in!")

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if(err) return res.status(403).json("TOken is not valid")

        const q = "INSERT INTO stories (`img`, `userId`) VALUES (?)"

        const values = [
            req.body.img, 
            userInfo.id
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Story has been created.");
        })
    })
}



module.exports = {getStories, addStories}
const db = require("../connect")
const jwt = require("jsonwebtoken")
const moment = require("moment");

const getRelation = (req, res) => {
    const q = "SELECT followerUserID FROM relationship WHERE followedUserID = ?"

    db.query(q, [req.query.userId], (err, data) => {
        if(err) return res.status(500).json(err)
        return res.status(200).json(data.map(relation=> relation.followerUserID))
    })
}

const addRelation = (req, res) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(401).json("Not Logged in!")

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if(err) return res.status(403).json("TOken is not valid")

        const q = "INSERT INTO relationship (`followerUserID`, `followedUserID`) VALUES (?)"
        const values = [userInfo.id, req.body.userId]
        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json("Post Liked successfully")
        })

    })
}

const deleteRelation = (req, res) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(401).json("Not Logged in!")

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if(err) return res.status(403).json("TOken is not valid")

        const q = "DELETE FROM relationship WHERE `followerUserID` = ? AND `followedUserID` = ?"
        
        db.query(q, [userInfo.id, req.query.userId], (err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json("Delete Liked successfully")
        })

    })
}

module.exports = {getRelation, deleteRelation, addRelation}
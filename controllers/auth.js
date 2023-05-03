const db = require("../connect")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const register = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?"

    db.query(q, [req.body.username], (err, data) => {
        if(err) return res.status(500).json(err)
        if(data.length) return res.status(409).json("USer already exist")
        
        const salt = bcrypt.genSaltSync(10)
        const hashPass = bcrypt.hashSync(req.body.password, salt)
        
        const newq = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUE (?)"

        const values = [req.body.username, req.body.email, hashPass, req.body.name]

        db.query(newq, [values], (err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(201).json({msg:"user has been created", data})
        })
    })
}

const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?"
    db.query(q, [req.body.username], (err, data) => {
        if(err) return res.status(500).json(err)
        if(data.length === 0) return res.status(404).send("User not found")

        const checkPass = bcrypt.compareSync(req.body.password, data[0].password)

        if(!checkPass){
            return res.status(404).send("Wrong Password or username")
        }

        const token = jwt.sign({id: data[0].id}, "secretKey")
        const {password, ...others} = data[0]

        res.cookie("accessToken", token,{
          secure: process.env.NODE_ENV === 'localhost' ? 'auto' : true,
          httpOnly: true,
          maxAge: 7*24*60*60*1000,   //days*hoursPerDay*minutesPerHour*secondsPerMinute*1000
          sameSite: process.env.NODE_ENV === 'localhost' ? 'lax' : 'none',
        }).status(200).json(others)
    })
}

const logOut = (req, res) => {
    res.cookie('accessToken', null, {
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === 'localhost' ? 'auto' : true,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'localhost' ? 'lax' : 'none',  
    }).status(200).json({
        success: true,
        message: "logged Out",
    });
}

module.exports = {register, login, logOut}
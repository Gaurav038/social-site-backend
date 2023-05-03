const express = require("express")
const { getUser, updateUser, getAllUser } = require("../controllers/user")
const userRouter = express.Router()

userRouter.get("/find/:userId", getUser)
userRouter.get("/allUser/:userId", getAllUser)
userRouter.put("/", updateUser)

module.exports = userRouter
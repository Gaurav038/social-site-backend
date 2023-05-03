const express = require("express")
const { getComment, addComment } = require("../controllers/comment")
const router = express.Router()

router.get("/", getComment)
router.post("/", addComment)

module.exports = router
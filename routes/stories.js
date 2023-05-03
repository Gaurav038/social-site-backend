const express = require("express")
const {getStories,addStories, deleteStories } = require("../controllers/story")
const router = express.Router()

router.get("/", getStories )
router.post("/", addStories )

module.exports = router
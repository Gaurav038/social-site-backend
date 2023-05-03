const express = require("express")
const { getLike, addLike, deleteLike } = require("../controllers/like")
const router = express.Router()

router.get("/", getLike)
router.post("/", addLike)
router.delete("/", deleteLike)

module.exports = router

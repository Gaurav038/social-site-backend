const express = require("express")
const { getRelation, addRelation, deleteRelation } = require("../controllers/relation")
const router = express.Router()

router.get("/", getRelation)
router.post("/", addRelation)
router.delete("/", deleteRelation)

module.exports = router

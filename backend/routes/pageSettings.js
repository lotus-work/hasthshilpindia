const express = require("express");
const { updatePage, getPage } = require("../controller/pageSettings");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.put("/update", authMiddleware, isAdmin, updatePage);
router.get("/:id", getPage);

module.exports = router;

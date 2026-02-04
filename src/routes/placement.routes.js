const express = require("express");
const router = express.Router();
const { getAllPlacements, addPlacement, updatePlacement, deletePlacement } = require("../controllers/placement.controller");
const { authenticate, authorizeAdmin } = require("../middleware/auth.middleware");

router.get("/", getAllPlacements);
router.post("/", authenticate, authorizeAdmin, addPlacement);
router.put("/:id", authenticate, authorizeAdmin, updatePlacement);
router.delete("/:id", authenticate, authorizeAdmin, deletePlacement);

module.exports = router;

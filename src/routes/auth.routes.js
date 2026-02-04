const express = require("express");
const router = express.Router();
const { register, login, logout, getAllUsers, updateUserRole, deleteUser, getStudents } = require("../controllers/auth.controller");
const { authenticate, authorizeAdmin, authorizeOnlyAdmin } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticate, logout);

// Admin routes
router.get("/users", authenticate, authorizeAdmin, getAllUsers);
router.put("/users/role", authenticate, authorizeAdmin, updateUserRole);
router.delete("/users/:userId", authenticate, authorizeAdmin, deleteUser);

// Students route (Admin only)
router.get("/students", authenticate, authorizeOnlyAdmin, getStudents);

module.exports = router;

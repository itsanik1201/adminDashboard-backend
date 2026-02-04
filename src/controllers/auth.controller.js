const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Activity = require("../models/activity.model");

const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber;
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, portalAccessLevel } = req.body;
    const role = portalAccessLevel || req.body.role || "STUDENT";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists. Please sign in instead."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const candidate = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    await Activity.create({
      type: "SIGNUP",
      userId: candidate._id
    });

    res.status(201).json({ message: "Registration successful. You can now sign in." });
  } catch (error) {
    res.status(500).json({
      message: "We couldn't complete your registration. Please try again in a moment."
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = await User.findOne({ email });
    if (!candidate) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    const isMatch = await bcrypt.compare(password, candidate.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      { id: candidate._id, role: candidate.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await Activity.create({
      type: "LOGIN",
      userId: candidate._id
    });

    res.json({
      token,
      role: candidate.role,
      name: candidate.name
    });
  } catch (error) {
    res.status(500).json({
      message: "We couldn't reach the NITJ server. Please try again in a moment."
    });
  }
};

exports.logout = async (req, res) => {
  try {
    await Activity.create({
      type: "LOGOUT",
      userId: req.user.id
    });

    res.json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Logout failed. Please try again."
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve users. Please try again."
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: "User ID and role are required." });
    }

    const validRoles = ['STUDENT', 'TPC', 'DEPT_HEAD', 'ADMIN'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User role updated successfully.", user });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user role. Please try again."
    });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user. Please try again."
    });
  }
};
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'STUDENT' }, '-password'); 
    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve students. Please try again."
    });
  }
};

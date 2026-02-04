const Placement = require("../models/placement.model");

// GET ALL PLACEMENTS
exports.getAllPlacements = async (req, res) => {
  try {
    const placements = await Placement.find();
    res.json(placements);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve placements. Please try again."
    });
  }
};

// ADD PLACEMENT
exports.addPlacement = async (req, res) => {
  try {
    const { company, students, avgSalary, branch, year } = req.body;

    if (!company || !students || !avgSalary || !branch) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const placement = await Placement.create({
      company,
      students,
      avgSalary,
      branch,
      year: year || new Date().getFullYear()
    });

    res.status(201).json({ message: "Placement added successfully.", placement });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add placement. Please try again."
    });
  }
};

// UPDATE PLACEMENT
exports.updatePlacement = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const placement = await Placement.findByIdAndUpdate(id, updates, { new: true });

    if (!placement) {
      return res.status(404).json({ message: "Placement not found." });
    }

    res.json({ message: "Placement updated successfully.", placement });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update placement. Please try again."
    });
  }
};

// DELETE PLACEMENT
exports.deletePlacement = async (req, res) => {
  try {
    const { id } = req.params;

    const placement = await Placement.findByIdAndDelete(id);

    if (!placement) {
      return res.status(404).json({ message: "Placement not found." });
    }

    res.json({ message: "Placement deleted successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete placement. Please try again."
    });
  }
};

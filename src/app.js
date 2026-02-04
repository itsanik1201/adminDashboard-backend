require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const placementRoutes = require("./routes/placement.routes");

const app = express();

app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://admin-dashboard-frontend-delta.vercel.app/'
  ],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/placements", placementRoutes);

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const cookieParser = require("cookie-parser");
const instructionRoutes = require("./routes/instructionRoutes");
const internshipRoutes = require("./routes/internshipRoutes");

// Import models to ensure Sequelize loads them
require("./models/StudentPreference");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Test route
app.post("/test", (req, res) => {
  console.log(req.body);
  res.json({ status: "Hello world from pre-internship" });
});

// Routes
app.use("/api/instructions", instructionRoutes);
app.use("/api/internships", internshipRoutes);

// Database connection verification
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit if the database is not connected
  }
}

// Database sync and server start
const PORT = process.env.PORT || 4001;

async function startServer() {
  await connectDB(); // Ensure DB is connected before syncing

  try {
    await sequelize.sync({ alter: true }); // Change to `sequelize.sync({ force: true })` only for development/testing
    console.log("✅ Database synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error);
  }
}

startServer();

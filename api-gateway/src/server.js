const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const authRoutes = require("./routes/auth");
const { authenticateToken, authorizeRole } = require("./middleware/auth");
const sequelize = require("./config/database");

const studentRoutes = require("./routes/studentRoute");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

// Auth routes (login, register)
app.get("/", (req, res) => {
  res.json({ status: "Hello world" });
});

// Routes
app.use("/api/v1/student", studentRoutes);

// Proxy middleware configuration
const serviceOneProxy = createProxyMiddleware({
  target: "http://localhost:4001",
  changeOrigin: true,
  pathRewrite: {
    "^/pre-internship": "/",
  },
});

const serviceTwoProxy = createProxyMiddleware({
  target: "http://service-two:8002",
  changeOrigin: true,
  pathRewrite: {
    "^/service-two": "/",
  },
});

// Protected routes with role-based access
// app.use(
//   "/pre-internship",
//   authenticateToken,
//   authorizeRole(["admin", "student"]),
//   serviceOneProxy
// );
app.use("/pre-internship", serviceOneProxy);
app.use(
  "/service-two",
  authenticateToken,
  authorizeRole(["admin"]),
  serviceTwoProxy
);

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

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

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

const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const authRoutes = require("./routes/auth");
const sequelize = require("./config/database");
const cookieParser = require("cookie-parser");
const validate = require("./middleware/validate");

const studentRoutes = require("./routes/studentRoute");

const app = express();
const PORT = process.env.PORT || 4000;

require("dotenv").config();

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: `${process.env.INTERNSHIP_FRONTEND_URL}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Auth routes (login, register)
app.get("/", (req, res) => {
  res.json({ status: "Hello world" });
});

app.use("/auth", authRoutes);

// Routes
app.use("/api/v1/student", validate, studentRoutes);

// Proxy middleware configuration
const serviceOneProxy = createProxyMiddleware({
  target: "http://localhost:4001",
  changeOrigin: true,
  pathRewrite: {
    "^/pre-internship": "/",
  },
  onProxyReq: (proxyReq, req) => {
    // Forward user data as headers
    if (req.user) {
      proxyReq.setHeader("user-email", req.user?.email);
    }
  },
});

// const serviceTwoProxy = createProxyMiddleware({
//   target: "http://service-two:8002",
//   changeOrigin: true,
//   pathRewrite: {
//     "^/service-two": "/",
//   },
// });

// Protected routes with role-based access
// app.use(
//   "/pre-internship",
//   authenticateToken,
//   authorizeRole(["admin", "student"]),
//   serviceOneProxy
// );
app.use("/pre-internship", validate, serviceOneProxy);

// app.use(
//   "/service-two",
//   authenticateToken,
//   authorizeRole(["admin"]),
//   serviceTwoProxy
// );

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

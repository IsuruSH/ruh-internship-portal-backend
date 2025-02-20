const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const authRoutes = require("./routes/auth");
const sequelize = require("./config/database");
const cookieParser = require("cookie-parser");
const validate = require("./middleware/validate");
const Admin = require("./models/Admin");
const bcrypt = require("bcrypt");

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
  credentials: "include",
  onProxyReq: (proxyReq, req) => {
    // Forward user data as headers
    if (req.user) {
      proxyReq.setHeader("user-email", req.user?.email);
    }
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader("Content-Type", "application/json");
      proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
      proxyReq.end();
    }
  },
  onProxyRes: (proxyRes) => {
    proxyRes.headers["Access-Control-Allow-Origin"] =
      process.env.INTERNSHIP_FRONTEND_URL; // Fix CORS issue
    proxyRes.headers["Access-Control-Allow-Credentials"] = "true"; // Allow credentials
  },
});

const serviceTwoProxy = createProxyMiddleware({
  target: "http://localhost:8080",
  changeOrigin: true,
  pathRewrite: {
    "^/post-internship": "/",
  },
  onProxyReq: (proxyReq, req) => {
    // Forward user data as headers
    if (req.user) {
      proxyReq.setHeader("user-email", req.user?.email);
    }
  },
});

app.use("/pre-internship", validate, serviceOneProxy);
app.use("/post-internship", serviceTwoProxy);

// Database connection verification
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
    await sequelize.sync({ alter: true }); // Change to `sequelize.sync({ force: true })` only for development/testing
    console.log("✅ Database synchronized successfully.");

    const adminExists = await Admin.findOne({
      where: { email: "admin@example.com" },
    });

    if (!adminExists) {
      // Hash password before saving
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      // Create a default admin
      await Admin.create({
        username: "Super Admin",
        email: "admin@example.com",
        password: hashedPassword,
      });

      console.log("✅ Default admin created.");
    } else {
      console.log("✅ Admin already exists.");
    }
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
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error);
  }
}

startServer();

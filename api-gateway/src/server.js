const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const authRoutes = require("./routes/auth");
const { authenticateToken, authorizeRole } = require("./middleware/auth");

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

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

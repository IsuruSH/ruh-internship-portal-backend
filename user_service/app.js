import express from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use("/auth", authRoutes);

app.listen(4000, () => {
  console.log(`Server running on port ${PORT}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", userRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});
import express from "express";
import { predecirIA, getAnalisisIA } from "../controllers/iaController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Predicción simple (endpoint original, sin cambios)
router.post("/prediccion", predecirIA);

// Análisis completo para el módulo IA del frontend
router.get("/analisis", verifyToken, getAnalisisIA);

export default router;
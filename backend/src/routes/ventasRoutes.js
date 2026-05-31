import express from "express";

import {
  getVentas,
  getVentaById,
  createVenta,
  updateVenta,
  deleteVenta,
  getDashboardData
} from "../controllers/ventasController.js";

import {
  verifyToken,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ==============================
// DASHBOARD (para la IA)
// ==============================
router.get("/dashboard", verifyToken, getDashboardData);


// ==============================
// GET ALL
// ==============================
router.get("/", verifyToken, getVentas);


// ==============================
// GET BY ID
// ==============================
router.get("/:id", verifyToken, getVentaById);


// ==============================
// CREATE
// ==============================
router.post("/", verifyToken, createVenta);


// ==============================
// UPDATE
// ==============================
router.put("/:id", verifyToken, updateVenta);


// ==============================
// DELETE
// ==============================
router.delete("/:id", verifyToken, deleteVenta);


export default router;
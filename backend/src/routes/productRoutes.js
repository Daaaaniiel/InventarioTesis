import express from "express";

import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../controllers/productController.js";

import {
  verifyToken,
  isAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// GET
router.get("/", verifyToken, getProductos);

// CREATE
router.post("/", verifyToken, isAdmin, createProducto);

// UPDATE
router.put("/:id", verifyToken, isAdmin, updateProducto);

// DELETE
router.delete("/:id", verifyToken, isAdmin, deleteProducto);

export default router;
import express from "express";
import {
  getUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from "../controllers/userController.js";

import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

//  TODAS protegidas + solo admin
router.get("/", verifyToken, isAdmin, getUsuarios);
router.get("/:id", verifyToken, isAdmin, getUsuario);
router.post("/", verifyToken, isAdmin, createUsuario);
router.put("/:id", verifyToken, isAdmin, updateUsuario);
router.delete("/:id", verifyToken, isAdmin, deleteUsuario);

export default router;
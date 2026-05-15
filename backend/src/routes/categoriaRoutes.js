import { Router } from "express";

import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from "../controllers/categoriaController.js";

//  middleware auth
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// ================= RUTAS =================

// Obtener categorías
router.get(
  "/",
  verifyToken,
  getCategorias
);

// Crear categoría
router.post(
  "/",
  verifyToken,
  isAdmin,
  createCategoria
);

// Actualizar categoría
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  updateCategoria
);

// Eliminar categoría
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteCategoria
);

export default router;
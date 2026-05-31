import express from "express";

import {
  predecirIA
} from "../controllers/iaController.js";

const router = express.Router();

router.post(
  "/prediccion",
  predecirIA
);

export default router;
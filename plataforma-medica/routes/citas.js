import express from "express";
import {
  obtenerCitas,
  cancelarCita,
  reagendarCita
} from "../controllers/citasController.js";

const router = express.Router();

// GET /citas/:usuarioId
router.get("/:usuarioId", obtenerCitas);

// DELETE /citas/:id
router.delete("/:id", cancelarCita);

// PUT /citas/:id
router.put("/:id", reagendarCita);

export default router;

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import citasRoutes from "./routes/citas.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/auth", authRoutes);
app.use("/citas", citasRoutes);

app.listen(3001, () => {
  console.log("Servidor backend iniciado en http://localhost:3001");
});

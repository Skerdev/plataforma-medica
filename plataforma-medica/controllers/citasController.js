import fs from "fs";
import path from "path";

function leerBD() {
  const ruta = path.resolve("data/db.json");
  return JSON.parse(fs.readFileSync(ruta, "utf8"));
}

function guardarBD(data) {
  const ruta = path.resolve("data/db.json");
  fs.writeFileSync(ruta, JSON.stringify(data, null, 2));
}

export function obtenerCitas(req, res) {
  const db = leerBD();
  const usuarioId = Number(req.params.usuarioId);

  const citas = db.citas.filter((c) => c.usuarioId === usuarioId);

  res.json(citas);
}

export function cancelarCita(req, res) {
  const db = leerBD();
  const id = Number(req.params.id);

  db.citas = db.citas.filter((c) => c.id !== id);
  guardarBD(db);

  res.json({ mensaje: "Cita cancelada" });
}

export function reagendarCita(req, res) {
  const db = leerBD();
  const id = Number(req.params.id);
  const { fecha, hora } = req.body;

  const cita = db.citas.find((c) => c.id === id);

  if (!cita) return res.status(404).json({ error: "Cita no encontrada" });

  cita.fecha = fecha;
  cita.hora = hora;

  guardarBD(db);

  res.json({ mensaje: "Cita reagendada", cita });
}

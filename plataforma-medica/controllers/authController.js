import fs from "fs";
import path from "path";

export function login(req, res) {
  const rutaBD = path.resolve("data/db.json");
  const db = JSON.parse(fs.readFileSync(rutaBD, "utf8"));

  const { email, password } = req.body;

  const usuario = db.usuarios.find(
    (u) => u.email === email && u.password === password
  );

  if (!usuario) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  // Esto es lo que el frontend necesita
  const respuesta = {
    user: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email
    },
    token: "fake-token-1234" // luego lo puedes cambiar, por ahora funciona
  };

  res.json(respuesta);
}

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Cita {
  id: number;
  usuarioId: number;
  servicio: string;
  fecha: string;
  hora: string;
}

export default function CitasPage() {
  const { user } = useAuth();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [editando, setEditando] = useState<Cita | null>(null);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("");

  useEffect(() => {
    if (!user) return;

    async function cargarCitas() {
      const res = await fetch(`http://localhost:3001/citas/${user!.id}`);
      const data = await res.json();
      setCitas(data);
    }

    cargarCitas();
  }, [user]);

  async function cancelarCita(id: number) {
    await fetch(`http://localhost:3001/citas/${id}`, { method: "DELETE" });
    setCitas(citas.filter((c) => c.id !== id));
  }

  function activarEdicion(cita: Cita) {
    setEditando(cita);
    setNuevaFecha(cita.fecha);
    setNuevaHora(cita.hora);
  }

  async function guardarCambios() {
    if (!editando) return;

    const res = await fetch(`http://localhost:3001/citas/${editando.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fecha: nuevaFecha,
        hora: nuevaHora,
      }),
    });

    const data = await res.json();

    setCitas(
      citas.map((c) => (c.id === editando.id ? data.cita : c))
    );

    setEditando(null);
  }

  if (!user) return <p>Cargando...</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto" }}>
      <h2>Mis Citas Médicas</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {citas.map((cita) => (
          <li key={cita.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "6px",
              }}>
            
            <p><strong>{cita.servicio}</strong></p>
            <p>Fecha: {cita.fecha}</p>
            <p>Hora: {cita.hora}</p>

            <button
              onClick={() => cancelarCita(cita.id)}
              style={{ marginRight: "10px" }}
            >
              Cancelar
            </button>

            <button onClick={() => activarEdicion(cita)}>
              Reagendar
            </button>

          </li>
        ))}
      </ul>

      {/* FORMULARIO DE REAGENDAMIENTO */}
      {editando && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #999",
            borderRadius: "6px",
          }}
        >
          <h3>Reagendar Cita</h3>

          <div>
            <label>Nueva fecha:</label>
            <input
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              style={{ display: "block", marginBottom: "10px" }}
            />
          </div>

          <div>
            <label>Nueva hora:</label>
            <input
              type="time"
              value={nuevaHora}
              onChange={(e) => setNuevaHora(e.target.value)}
              style={{ display: "block", marginBottom: "10px" }}
            />
          </div>

          <button
            onClick={guardarCambios}
            style={{ marginRight: "10px" }}
          >
            Guardar cambios
          </button>

          <button onClick={() => setEditando(null)}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

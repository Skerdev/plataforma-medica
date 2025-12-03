import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Cita {
  id: number;
  usuarioId: number;
  servicio: string;
  fecha: string;
  hora: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [citaEditando, setCitaEditando] = useState<Cita | null>(null);

  // ------------------------------
  // Cargar citas del backend
  // ------------------------------
  useEffect(() => {
    if (!user) return;

    async function cargarCitas() {
      const res = await fetch(`http://localhost:3001/citas/${user!.id}`);
      const data = await res.json();
      setCitas(data);
    }

    cargarCitas();
  }, [user]);

  // ------------------------------
  // Cancelar cita
  // ------------------------------
  async function cancelarCita(id: number) {
    await fetch(`http://localhost:3001/citas/${id}`, {
      method: "DELETE",
    });

    // actualizar lista
    setCitas(citas.filter((c) => c.id !== id));
  }

  // ------------------------------
  // Guardar cambios al reagendar
  // ------------------------------
  async function guardarCambios() {
    if (!citaEditando) return;

    await fetch(`http://localhost:3001/citas/${citaEditando.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fecha: citaEditando.fecha,
        hora: citaEditando.hora,
      }),
    });

    // actualiza la lista
    setCitas(
      citas.map((c) => (c.id === citaEditando.id ? citaEditando : c))
    );

    setCitaEditando(null);
  }

  // ------------------------------
  // Vista (HTML)
  // ------------------------------
  return (
    <div style={{ padding: "20px" }}>
      <h2>Bienvenido, {user?.nombre}</h2>
      <h3>Tus próximas citas</h3>

      {citas.length === 0 ? (
        <p>No tienes citas programadas.</p>
      ) : (
        <ul>
          {citas.map((cita) => (
            <li key={cita.id} style={{ marginBottom: "15px" }}>
              <strong>{cita.servicio}</strong> — {cita.fecha} a las {cita.hora}

              <div style={{ marginTop: "5px" }}>
                <button
                  onClick={() => cancelarCita(cita.id)}
                  style={{ marginRight: "10px" }}
                >
                  Cancelar
                </button>

                <button onClick={() => setCitaEditando(cita)}>
                  Reagendar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* --------------------------------------------------- */}
      {/* Formulario para editar / reagendar */}
      {/* --------------------------------------------------- */}
      {citaEditando && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ccc",
            background: "#f8f8f8",
            width: "300px",
          }}
        >
          <h3>Reagendar cita</h3>

          <label>Fecha:</label>
          <input
            type="date"
            value={citaEditando.fecha}
            onChange={(e) =>
              setCitaEditando({
                ...citaEditando,
                fecha: e.target.value,
              })
            }
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <label>Hora:</label>
          <input
            type="time"
            value={citaEditando.hora}
            onChange={(e) =>
              setCitaEditando({
                ...citaEditando,
                hora: e.target.value,
              })
            }
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <button
            onClick={guardarCambios}
            style={{
              width: "100%",
              background: "blue",
              color: "white",
              padding: "8px",
              border: "none",
            }}
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  );
}

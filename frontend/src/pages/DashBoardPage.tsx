import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./DashboardPage.css";


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
    <div className="dashboard-container">

      <div className="dashboard-header">
        <h2>Bienvenido, {user?.nombre}</h2>
        <p>Gestiona tus citas médicas</p>
      </div>

      <div className="dashboard-image">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2966/2966486.png"
          alt="Citas médicas"
        />
      </div>

      <h3>Tus próximas citas</h3>

      {citas.length === 0 ? (
        <p>No tienes citas programadas.</p>
      ) : (
        <ul className="citas-list">
          {citas.map((cita) => (
            <li key={cita.id} className="cita-item">
              <strong>{cita.servicio}</strong>
              <p>{cita.fecha} — {cita.hora}</p>

              <div className="cita-actions">
                <button
                  className="btn-cancelar"
                  onClick={() => cancelarCita(cita.id)}
                >
                  Cancelar
                </button>

                <button
                  className="btn-reagendar"
                  onClick={() => setCitaEditando(cita)}
                >
                  Reagendar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {citaEditando && (
        <div className="form-reagendar">
          <h3>Reagendar cita</h3>

          <label>Fecha:</label>
          <input
            type="date"
            value={citaEditando.fecha}
            onChange={(e) =>
              setCitaEditando({ ...citaEditando, fecha: e.target.value })
            }
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <label>Hora:</label>
          <input
            type="time"
            value={citaEditando.hora}
            onChange={(e) =>
              setCitaEditando({ ...citaEditando, hora: e.target.value })
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

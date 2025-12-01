import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    }
  }

  return (
    <div style={{ width: 350, margin: "50px auto" }}>
      <h2>Iniciar sesión</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="form-control mb-2"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="form-control mb-2"
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="btn btn-primary w-100">Ingresar</button>
      </form>
    </div>
  );
}

import React, { useState, useContext } from "react";
import "../css/loginModal.css";
import { AuthContext } from "../authContext";

const LoginModal = ({ show, onClose, openSignup }) => {
  const { signIn } = useContext(AuthContext);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn(identifier, password);
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h3>Iniciar sesión</h3>

        <input type="text" placeholder="Correo o Username"
          disabled={loading}
          value={identifier} onChange={(e) => setIdentifier(e.target.value)} />

        <input type="password" placeholder="Contraseña"
          disabled={loading}
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        {loading && (
          <div className="loader"></div>
        )}

        <p onClick={!loading ? openSignup : null} className="toggle-form">Crear cuenta</p>
        <button className="close-btn" onClick={!loading ? onClose : null} disabled={loading}>Cerrar</button>
      </div>
    </div>
  );
};
export default LoginModal;
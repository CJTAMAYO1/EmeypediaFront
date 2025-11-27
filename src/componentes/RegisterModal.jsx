import React, { useState, useContext } from "react";
import "../css/loginModal.css";
import { AuthContext } from "../services/authContext";

export const RegisterModal = ({ show, onClose, openLogin }) => {
  const { signUp } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleRegister = async () => {
    setErrorMsg("");
    setLoading(true);

    if (!username || !email || !password) {
      setErrorMsg("Completa los campos obligatorios");
      setLoading(false);
      return;
    }

    try {
      const { ok } = await signUp(email, password, username, file, bio);

      if (ok) {
        onClose();
        if (openLogin) openLogin();
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2>Crear Cuenta</h2>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <input type="text" placeholder="Nombre de usuario *"
          disabled={loading}
          value={username} onChange={(e) => setUsername(e.target.value)} />

        <input type="email" placeholder="Correo *"
          disabled={loading}
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <input type="password" placeholder="Contraseña *"
          disabled={loading}
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <input type="file" accept="image/*"
          disabled={loading}
          onChange={(e) => setFile(e.target.files[0])} />

        <textarea placeholder="Biografía (opcional)"
          disabled={loading}
          value={bio} onChange={(e) => setBio(e.target.value)} />

        <button className="login-btn" onClick={handleRegister} disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>

        {loading && (
          <div className="loader"></div>
        )}

        <button className="close-btn" onClick={onClose} disabled={loading}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;

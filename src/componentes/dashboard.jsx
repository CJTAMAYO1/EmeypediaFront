import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import "../css/dashboard.css";
import { useNavigate } from "react-router-dom";



export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  // Obtener usuario actual
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // redirige al home
  };

  return (
    <div className="container">
      
      {/* SIDEBAR */}
      <div className="sidebar">
        <h4>Menú</h4>

        <ul>
          <li><a href="/perfil">Mi perfil</a></li>
          <li><a onClick={() => navigate("/subir-articulo")}>Subir artículo</a></li>
          <li><a href="/ajustes">Ajustes</a></li>
          <li>
            <button onClick={handleLogout} className="logout">Cerrar sesión</button>
          </li>
        </ul>
      </div>

      {/* CONTENIDO */}
      <div className="main-content">
        <h1>Bienvenido, {user?.user_metadata?.username || "Usuario"}</h1>

        <div className="card">
          <h5>Tu actividad reciente</h5>
          <p>Aquí verás tus artículos, comentarios y actividad en la plataforma.</p>
        </div>

        <div className="card">
          <h5>Favoritos</h5>
          <p>Aún no has agregado artículos a favoritos.</p>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}

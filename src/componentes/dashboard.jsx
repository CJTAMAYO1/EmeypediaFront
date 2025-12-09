import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import "../css/dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [misArticulos, setMisArticulos] = useState([]);
  const [misComentarios, setMisComentarios] = useState([]);
  const navigate = useNavigate();

  const fetchArticulos = async (username) => {
    const { data: articulos } = await supabase
      .from("articulos_articulo")
      .select("*")
      .eq("autor", username);
    setMisArticulos(articulos || []);
  };

  const fetchComentarios = async (username) => {
    // Obtener comentarios junto con título del artículo
    const { data: comentarios } = await supabase
      .from("comentarios_comentario")
      .select(`
        id,
        texto,
        articulo_id,
        articulo:articulo_id(id, titulo)
      `)
      .eq("autor", username);

    setMisComentarios(comentarios || []);
  };

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const userData = data?.user ?? null;
      setUser(userData);

      if (userData) {
        const username = userData.user_metadata?.username;
        await fetchArticulos(username);
        await fetchComentarios(username);
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleEliminarArticulo = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este artículo?")) {
      await supabase.from("articulos_articulo").delete().eq("id", id);
      fetchArticulos(user.user_metadata.username);
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h4>Menú</h4>
        <ul>
          <li><a onClick={()=> navigate("/perfil")}>Mi perfil</a></li>
          <li><a onClick={() => navigate("/subir-articulo")}>Subir artículo</a></li>
          <li><a href="/ajustes">Ajustes</a></li>
          <li><button onClick={handleLogout} className="logout">Cerrar sesión</button></li>
        </ul>
      </div>

      <div className="main-content">
        <h1>Bienvenido, {user?.user_metadata?.username || "Usuario"}</h1>

        <div className="card">
          <h5>Mis artículos</h5>
          {misArticulos.length === 0 ? (
            <p>No has escrito artículos todavía.</p>
          ) : (
            <ul>
              {misArticulos.map((a) => (
                <li key={a.id}>
                  <a href={`/articulo/${a.id}`}>
                    {a.titulo} — <span className="badge">{a.tipo}</span>
                  </a>
                  <button 
                    onClick={() => navigate(`/editar-articulo/${a.id}`)} 
                    style={{ marginLeft: "8px" }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleEliminarArticulo(a.id)}
                    style={{ marginLeft: "4px" }}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h5>Mis comentarios</h5>
          {misComentarios.length === 0 ? (
            <p>No has comentado aún.</p>
          ) : (
            <ul>
              {misComentarios.map((c) => (
                <li key={c.id}>
                  <strong>En artículo: </strong>
                  <a href={`/articulo/${c.articulo_id}`}>
                    {c.articulo?.titulo || "Artículo eliminado"}
                  </a>
                  <br />
                  {c.texto.substring(0, 100)}...
                </li>
              ))}
            </ul>
          )}
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}

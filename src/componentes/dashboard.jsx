import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import "../css/dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [misArticulos, setMisArticulos] = useState([]);
  const [misComentarios, setMisComentarios] = useState([]);
  const navigate = useNavigate();

  // --- Funciones de Carga de Datos ---
  const fetchArticulos = async (username) => {
    const { data: articulos, error } = await supabase
      .from("articulos_articulo")
      .select("*")
      .eq("autor", username); // Filtra por el nombre de usuario
    
    if (error) {
      console.error("Error cargando artículos:", error.message);
    } else {
      setMisArticulos(articulos || []);
    }
  };

  const fetchComentarios = async (username) => {
    // Obtenemos comentarios y el título del artículo asociado
    const { data: comentarios, error } = await supabase
      .from("comentarios_comentario")
      .select(`
        id,
        texto,
        articulo_id,
        articulo:articulo_id(id, titulo)
      `)
      .eq("autor", username);

    if (error) {
      console.error("Error cargando comentarios:", error.message);
    } else {
      setMisComentarios(comentarios || []);
    }
  };

  // --- useEffect Inicial ---
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      const userData = data?.user ?? null;
      setUser(userData);

      if (userData) {
        // Usamos el username guardado en user_metadata
        const username = userData.user_metadata?.username;
        if (username) {
          await fetchArticulos(username);
          await fetchComentarios(username);
        }
      }
    };
    getSession();
  }, []);

  // --- Cerrar Sesión ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // --- LÓGICA CORREGIDA DE ELIMINACIÓN ---
  const handleEliminarArticulo = async (id) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de borrar este artículo permanentemente? También se borrarán sus comentarios asociados."
    );

    if (!confirmacion) return;

    try {
      // 1. Petición a Supabase para borrar la fila exacta por ID
      const { error } = await supabase
        .from("articulos_articulo")
        .delete()
        .eq("id", id);

      if (error) {
        // Si hay error (ej. permisos o falta de configuración CASCADE en SQL)
        alert("Error al eliminar: " + error.message);
        console.error(error);
      } else {
        // 2. Si es exitoso, actualizamos la lista visualmente sin recargar
        setMisArticulos((prev) => prev.filter((art) => art.id !== id));
        alert("Artículo eliminado correctamente.");
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      alert("Ocurrió un error inesperado.");
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h4>Menú</h4>
        <ul>
          <li><a onClick={() => navigate("/perfil")}>Mi perfil</a></li>
          <li><a onClick={() => navigate("/subir-articulo")}>Subir artículo</a></li>
          <li><a onClick={() => navigate("/app-advantages")}>Conoce nuestra app</a></li>
          <li><button onClick={handleLogout} className="logout">Cerrar sesión</button></li>
        </ul>
      </div>

      <div className="main-content">
        <h1>Bienvenido, {user?.user_metadata?.username || "Usuario"}</h1>

        {/* SECCIÓN ARTÍCULOS */}
        <div className="card">
          <h5>Mis artículos</h5>
          {misArticulos.length === 0 ? (
            <p>No has escrito artículos todavía.</p>
          ) : (
            <ul>
              {misArticulos.map((a) => (
                <li key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div>
                    <a href={`/articulo/${a.id}`} style={{ fontWeight: 'bold' }}>
                      {a.titulo}
                    </a>
                    <span className="badge" style={{ marginLeft: "10px" }}>{a.tipo}</span>
                  </div>
                  
                  <div>
                    <button 
                      onClick={() => navigate(`/editar-articulo/${a.id}`)} 
                      style={{ cursor: "pointer", marginRight: "10px" }}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleEliminarArticulo(a.id)}
                      style={{ 
                        cursor: "pointer", 
                        backgroundColor: "#ff4444", 
                        color: "white", 
                        border: "none", 
                        padding: "5px 10px", 
                        borderRadius: "5px" 
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* SECCIÓN COMENTARIOS */}
        <div className="card">
          <h5>Mis comentarios</h5>
          {misComentarios.length === 0 ? (
            <p>No has comentado aún.</p>
          ) : (
            <ul>
              {misComentarios.map((c) => (
                <li key={c.id}>
                  <strong>En artículo: </strong>
                  {c.articulo ? (
                    <a href={`/articulo/${c.articulo_id}`}>
                      {c.articulo.titulo}
                    </a>
                  ) : (
                    <span style={{ color: "gray" }}>Artículo eliminado</span>
                  )}
                  <br />
                  <span style={{ fontSize: "0.9rem", color: "#555" }}>
                    "{c.texto.substring(0, 100)}{c.texto.length > 100 ? "..." : ""}"
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Espaciado final */}
        <br /><br /><br /><br />
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import "../css/articuloDetalle.css";

const ArticuloDetalle = () => {
  const { id } = useParams();
  const [articulo, setArticulo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [user, setUser] = useState(null);
  const [cargandoComentario, setCargandoComentario] = useState(false);

  // Fetch artículo
  const fetchArticulo = async () => {
    const { data, error } = await supabase
      .from("articulos_articulo")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) setArticulo(data);
    setLoading(false);
  };

  // Fetch comentarios del artículo
  const fetchComentarios = async () => {
    const { data, error } = await supabase
      .from("comentarios_comentario")
      .select("*")
      .eq("articulo_id", id)
      .order("fecha_creacion", { ascending: true });

    if (!error) setComentarios(data || []);
  };

  useEffect(() => {
    fetchArticulo();
    fetchComentarios();

    // Obtener usuario logueado
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
  }, [id]);

  const handleComentar = async () => {
    if (!user) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }
    if (!nuevoComentario.trim()) return;

    setCargandoComentario(true);

    const { error } = await supabase
      .from("comentarios_comentario")
      .insert({
        texto: nuevoComentario,
        articulo_id: id,
        autor: user.user_metadata.username,
        fecha_creacion: new Date(),
      });

    if (!error) {
      setNuevoComentario("");
      fetchComentarios();
    } else {
      console.error(error);
      alert("Error al enviar comentario.");
    }

    setCargandoComentario(false);
  };

  const handleEliminarComentario = async (comentarioId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este comentario?")) return;

    const { error } = await supabase
      .from("comentarios_comentario")
      .delete()
      .eq("id", comentarioId)
      .eq("autor", user.user_metadata.username);

    if (!error) {
      fetchComentarios();
    } else {
      console.error(error);
      alert("No se pudo eliminar el comentario.");
    }
  };

  if (loading) return <p className="cargando">Cargando artículo...</p>;
  if (!articulo) return <p>No se encontró el artículo</p>;

  const secciones = [
    { key: "resumen", title: "Resumen" },
    { key: "guias", title: "Guías" },
    { key: "historia", title: "Historia" },
    { key: "noticias", title: "Noticias" },
    { key: "opiniones", title: "Opiniones" },
    { key: "curiosidades", title: "Curiosidades" },
    { key: "memes", title: "Memes" },
    { key: "eventos", title: "Eventos" },
  ];

  return (
    <main className="detalle-container">
      {/* Tabla de contenidos */}
      <aside className="toc">
        <h5><strong>Tabla de Contenidos</strong></h5>
        <ul>
          {secciones.map((sec, i) =>
            articulo[sec.key] ? (
              <li key={i}>
                <a href={`#sec${i + 1}`}>{i + 1}. {sec.title}</a>
              </li>
            ) : null
          )}
        </ul>
      </aside>

      {/* Contenido del artículo */}
      <article className="contenido">
        <h1>{articulo.titulo}</h1>
        <hr />

        {secciones.map((sec, i) =>
          articulo[sec.key] ? (
            <section key={i}>
              <h3 id={`sec${i + 1}`}>{sec.title}</h3>
              <p>{articulo[sec.key]}</p>
            </section>
          ) : null
        )}

        {articulo.gameplay && (
          <section>
            <h3>Gameplay</h3>
            <video controls className="media">
              <source src={articulo.gameplay} type="video/mp4" />
              Tu navegador no soporta el video.
            </video>
          </section>
        )}

        {articulo.imagenes && (
          <section>
            <h3>Imagen relacionada</h3>
            <img src={articulo.imagenes} alt={articulo.titulo} className="media" />
          </section>
        )}
      </article>

      {/* Comentarios */}
      <aside className="comentarios-box">
        <h5>Comentarios ({comentarios.length})</h5>

        {/* Caja para comentar arriba */}
        {user ? (
          <div className="nuevo-comentario" style={{ marginBottom: "20px" }}>
            <textarea
              rows="3"
              placeholder="Escribe tu comentario..."
              value={nuevoComentario}
              onChange={e => setNuevoComentario(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <button 
              onClick={handleComentar} 
              disabled={cargandoComentario}
              style={{ padding: "8px 16px", borderRadius: "5px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}
            >
              {cargandoComentario ? "Enviando..." : "Comentar"}
            </button>
          </div>
        ) : (
          <p>Inicia sesión para comentar.</p>
        )}

        {comentarios.length === 0 && <p>Aún no hay comentarios. Sé el primero en comentar 😊</p>}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {comentarios.map(c => (
            <li 
              key={c.id} 
              style={{ 
                border: "1px solid #ddd", 
                borderRadius: "5px", 
                padding: "10px", 
                marginBottom: "10px", 
                backgroundColor: "#f9f9f9"
              }}
            >
              <strong>{c.autor}</strong> ({new Date(c.fecha_creacion).toLocaleString()}):
              <p style={{ marginTop: "5px" }}>{c.texto}</p>

              {user && user.user_metadata.username === c.autor && (
                <div style={{ textAlign: "right", marginTop: "8px" }}>
                  <button
                    onClick={() => handleEliminarComentario(c.id)}
                    style={{ 
                      backgroundColor: "#dc3545", 
                      color: "#fff", 
                      border: "none", 
                      borderRadius: "5px", 
                      padding: "5px 10px", 
                      cursor: "pointer" 
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
};

export default ArticuloDetalle;

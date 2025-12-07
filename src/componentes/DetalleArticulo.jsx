import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../services/supabaseClient"
import "../css/articuloDetalle.css"

const ArticuloDetalle = () => {
  const { id } = useParams()
  const [articulo, setArticulo] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch artículo
  const fetchArticulo = async () => {
    const { data, error } = await supabase
      .from("articulos_articulo")
      .select("*")
      .eq("id", id)
      .single()

    if (!error) setArticulo(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchArticulo()
  }, [id])

  if (loading) return <p className="cargando">Cargando artículo...</p>
  if (!articulo) return <p>No se encontró el artículo</p>

  // Campos de contenido
  const secciones = [
    { key: "resumen", title: "Resumen" },
    { key: "guias", title: "Guías" },
    { key: "historia", title: "Historia" },
    { key: "noticas", title: "Noticias" },
    { key: "opinones", title: "Opiniones" },
    { key: "curiosidades", title: "Curiosidades" },
    { key: "memes", title: "Memes" },
    { key: "eventos", title: "Eventos" }
  ]

  return (
    <main className="detalle-container">
      {/* Tabla de contenidos */}
      <aside className="toc">
        <h5><strong>Tabla de Contenidos</strong></h5>
        <ul>
          {secciones.map((sec, i) =>
            articulo[sec.key] ? (
              <li key={i}>
                <a href={`#sec${i + 1}`}>
                  {i + 1}. {sec.title}
                </a>
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

        {/* Video de gameplay */}
        {articulo.gameplay && (
          <section>
            <h3>Gameplay</h3>
            <video controls className="media">
              <source src={articulo.gameplay} type="video/mp4" />
              Tu navegador no soporta el video.
            </video>
          </section>
        )}

        {/* Imagen */}
        {articulo.imagenes && (
          <section>
            <h3>Imagen relacionada</h3>
            <img src={articulo.imagenes} alt={articulo.titulo} className="media" />
          </section>
        )}
      </article>

      {/* Comentarios */}
      <aside className="comentarios-box">
        <h5>Comentarios (pronto 👀)</h5>
        <p>Para comentar inicia sesión más adelante 😊</p>
      </aside>
    </main>
  )
}

export default ArticuloDetalle

import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../services/supabaseClient"
import banner1 from "../assets/banner1.png"
import banner2 from "../assets/banner2.png"
import banner3 from "../assets/banner3.png"
import "../css/inicio.css"

// Card de artículo
const MediaCard = ({ articulo }) => (
  <div className="media-card">
    <a href={`/articulo/${articulo.id}`}>
      <div className="media-card-img-wrapper">
        {articulo.imagenes && (
          <img
            src={articulo.imagenes}
            alt={articulo.titulo}
            className="media-card-img"
          />
        )}
      </div>
      <div className="media-card-title">{articulo.titulo}</div>
    </a>
  </div>
)

// Sección de medios
const MediaSection = ({ title, items }) => {
  if (!items || items.length === 0)
    return <p className="text-black px-3">No hay {title.toLowerCase()} disponibles aún.</p>

  return (
    <div className="media-section">
      <h2 className="section-title px-4 pt-4">{title}</h2>
      <div className="carousel-inner">
        {items.map(item => (
          <MediaCard articulo={item} key={item.id} />
        ))}
      </div>
    </div>
  )
}

// Component principal
const Inicio = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ---- Supabase Fetch ----
  const fetchArticulos = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("articulos_articulo")
      .select("*")
      .order("fechaSubida", { ascending: false }) // opcional

    if (error) {
      console.error(error)
      setError(error.message)
    } else {
      setData(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchArticulos()
  }, [])

  // Filtrar por tipo y solo con imagen
  const juegos = data.filter(a => a.tipo === "juego" && a.imagenes)
  const series = data.filter(a => a.tipo === "serie" && a.imagenes)
  const peliculas = data.filter(a => a.tipo === "pelicula" && a.imagenes)

  return (
    <div className="page-container">

      {/* Banner de promoción de la app */}
      <div className="app-promo-banner">
        <p>
          CONOCE NUESTRA <strong>APP móvil</strong> -{" "}
          <Link to="/app-advantages" className="app-promo-link">
            Ver ventajas
          </Link>
        </p>
      </div>

      {/* Carrusel */}
      <div id="carouselBanner" 
        className="carousel slide carousel-custom" 
        data-bs-ride="carousel" 
        data-bs-interval="4000"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={banner1} className="d-block w-100" alt="Banner 1" />
            <div className="carousel-caption d-none d-md-block"></div>
          </div>

          <div className="carousel-item">
            <img src={banner2} className="d-block w-100" alt="Banner 2" />
            <div className="carousel-caption d-none d-md-block"></div>
          </div>

          <div className="carousel-item">
            <img src={banner3} className="d-block w-100" alt="Banner 3" />
            <div className="carousel-caption d-none d-md-block"></div>
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#carouselBanner" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
          <span className="visually-hidden">Anterior</span>
        </button>

        <button className="carousel-control-next" type="button" data-bs-target="#carouselBanner" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      {/* Contenido */}
      {loading && <p className="text-black px-3">Cargando...</p>}
      {error && <p className="text-red-500 px-3">Error: {error}</p>}

      <MediaSection id="titulo" title="Juegos Populares" items={juegos} />
      <MediaSection title="Series Destacadas" items={series} />
      <MediaSection title="Películas Clásicas" items={peliculas} />

      <br />
      <br />
      <br />
    </div>
  )
}

export default Inicio

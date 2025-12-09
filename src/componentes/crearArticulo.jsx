import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import "../css/crear.css";

export default function SubirArticulo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Obtener usuario actual
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
  }, []);

  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [resumen, setResumen] = useState("");
  const [destacado, setDestacado] = useState(false);

  const [imagenes, setImagenes] = useState([]);
  const [video, setVideo] = useState(null);

  const [previewImgs, setPreviewImgs] = useState([]);
  const [previewVideo, setPreviewVideo] = useState("");

  const [categorias, setCategorias] = useState([]);

  const [cargando, setCargando] = useState(false);

  const agregarCategoria = () => {
    setCategorias([...categorias, { nombre: "", contenido: "" }]);
  };

  const eliminarCategoria = (index) => {
    setCategorias(categorias.filter((_, i) => i !== index));
  };

  const actualizarCategoria = (index, campo, valor) => {
    const copia = [...categorias];
    copia[index][campo] = valor;
    setCategorias(copia);
  };

  const handleImgPreview = (files) => {
    const arr = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviewImgs(arr);
  };

  const handleVideoPreview = (file) => {
    setPreviewVideo(URL.createObjectURL(file));
  };

  const subirArchivo = async (file) => {
    const nombre = `${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(nombre, file);

    if (error) {
      console.error(error);
      return null;
    }

    const { data: url } = supabase.storage
      .from("avatars")
      .getPublicUrl(nombre);

    return url.publicUrl; // 🔥 link limpio sin corchetes
  };

  const subirArticulo = async () => {
    if (!user) {
      alert("Debes iniciar sesión.");
      return;
    }

    setCargando(true);

    try {
      // SUBIR IMÁGENES
      const imgsURLs = [];
      for (let img of imagenes) {
        const url = await subirArchivo(img);
        if (url) imgsURLs.push(url);
      }

      // SUBIR VIDEO
      let videoURL = "";
      if (video) videoURL = await subirArchivo(video);

      // Construir categorías dinámicas en objeto
      const categoriasObj = categorias.reduce(
        (acc, c) => ({ ...acc, [c.nombre]: c.contenido }),
        {}
      );

      // GUARDAR ARTÍCULO
      const { error } = await supabase.from("articulos_articulo").insert({
        titulo,
        tipo,
        resumen,
        esTop: destacado,
        autor: user.user_metadata.username, // 🔥 AQUI SE GUARDA EL AUTOR
        imagenes: imgsURLs.join(","), // 🔥 string limpiecito
        gameplay: videoURL,
        fechaSubida: new Date(),
        ...categoriasObj,
      });

      if (error) {
        console.error(error);
        alert("Error al subir artículo");
        setCargando(false);
        return;
      }

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (err) {
      console.error(err);
    }

    setCargando(false);
  };

  return (
    <div className="upload-bg">
      <div className="upload-container">
        <h2 className="upload-title">Subir Artículo</h2>

        {/* TÍTULO */}
        <div className="field">
          <label>Título:</label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>

        {/* TIPO */}
        <div className="field">
          <label>Tipo:</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Selecciona un tipo</option>
            <option value="juego">Juego</option>
            <option value="serie">Serie</option>
            <option value="pelicula">Película</option>
            <option value="anime">Anime</option>
            <option value="libro">Libro</option>
            <option value="musica">Música</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        {/* RESUMEN */}
        <div className="field">
          <label>Resumen:</label>
          <textarea
            rows="4"
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
          />
        </div>

        {/* DESTACADO */}
        <div className="field">
          <label>
            <input
              type="checkbox"
              checked={destacado}
              onChange={(e) => setDestacado(e.target.checked)}
            />
            &nbsp;Artículo destacado
          </label>
        </div>

        {/* IMÁGENES */}
        <div className="field">
          <label>Imágenes:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              setImagenes(e.target.files);
              handleImgPreview(e.target.files);
            }}
          />

          {previewImgs.length > 0 &&
            previewImgs.map((src, i) => (
              <img key={i} src={src} className="preview-img" />
            ))}
        </div>

        {/* VIDEO */}
        <div className="field">
          <label>Gameplay (video):</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              setVideo(e.target.files[0]);
              handleVideoPreview(e.target.files[0]);
            }}
          />

          {previewVideo && (
            <video src={previewVideo} className="preview-video" controls />
          )}
        </div>

        {/* CATEGORÍAS DINÁMICAS */}
        <button className="add-cat-btn" onClick={agregarCategoria}>
          + Agregar categoría
        </button>
        <br />
        <br />
        <br />

        {categorias.map((cat, i) => (
          <div className="category-box" key={i}>
            <button className="remove-cat-btn" onClick={() => eliminarCategoria(i)}>
              X
            </button>

            <div className="category-fields">
              <select
                value={cat.nombre}
                onChange={(e) =>
                  actualizarCategoria(i, "nombre", e.target.value)
                }
              >
                <option value="">Selecciona categoría</option>
                <option value="guias">Guías</option>
                <option value="historia">Historia</option>
                <option value="noticias">Noticias</option>
                <option value="opiniones">Opiniones</option>
                <option value="curiosidades">Curiosidades</option>
                <option value="memes">Memes</option>
                <option value="eventos">Eventos</option>
              </select>

              <textarea
                rows="3"
                value={cat.contenido}
                onChange={(e) =>
                  actualizarCategoria(i, "contenido", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        {/* BOTÓN FINAL */}
        <button className="btn-submit" disabled={cargando} onClick={subirArticulo}>
          {cargando ? "Cargando..." : "Subir artículo"}
        </button>
      </div>
    </div>
  );
}

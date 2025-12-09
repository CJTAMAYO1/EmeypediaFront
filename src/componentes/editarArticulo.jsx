import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import "../css/crear.css";

export default function EditarArticulo() {
  const navigate = useNavigate();
  const { id } = useParams(); // id del artículo desde la URL
  const [user, setUser] = useState(null);

  // Estados
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [resumen, setResumen] = useState("");
  const [destacado, setDestacado] = useState(false);
  const [imagenes, setImagenes] = useState([]); // nuevas
  const [video, setVideo] = useState(null); // nuevo video
  const [previewImgs, setPreviewImgs] = useState([]); // nuevas previews
  const [previewVideo, setPreviewVideo] = useState("");
  const [imgsOriginales, setImgsOriginales] = useState([]); // actuales BD
  const [videoOriginal, setVideoOriginal] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Obtener usuario actual
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
  }, []);

  // Cargar artículo desde BD
  useEffect(() => {
    if (!id) return;
    const fetchArticulo = async () => {
      const { data, error } = await supabase
        .from("articulos_articulo")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        alert("No se pudo cargar el artículo");
        navigate("/dashboard");
        return;
      }

      setTitulo(data.titulo);
      setTipo(data.tipo);
      setResumen(data.resumen);
      setDestacado(data.esTop);
      setImgsOriginales(data.imagenes?.split(",") || []);
      setVideoOriginal(data.gameplay || "");

      // Categorías dinámicas
      const keys = ["guias","historia","noticias","opiniones","curiosidades","memes","eventos"];
      const cats = keys.filter(k => data[k]).map(k => ({ nombre: k, contenido: data[k] }));
      setCategorias(cats);
    };
    fetchArticulo();
  }, [id, navigate]);

  // Helpers
  const agregarCategoria = () => setCategorias([...categorias, { nombre: "", contenido: "" }]);
  const eliminarCategoria = (index) => setCategorias(categorias.filter((_, i) => i !== index));
  const actualizarCategoria = (index, campo, valor) => {
    const copia = [...categorias];
    copia[index][campo] = valor;
    setCategorias(copia);
  };

  const handleImgPreview = (files) => setPreviewImgs(Array.from(files).map(f => URL.createObjectURL(f)));
  const handleVideoPreview = (file) => setPreviewVideo(URL.createObjectURL(file));

  const subirArchivo = async (file) => {
    const nombre = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("avatars").upload(nombre, file);
    if (error) { console.error(error); return null; }
    const { data: url } = supabase.storage.from("avatars").getPublicUrl(nombre);
    return url.publicUrl;
  };

  // Actualizar artículo
  const actualizarArticulo = async () => {
    if (!user) { alert("Debes iniciar sesión."); return; }
    setCargando(true);

    try {
      // Imágenes
      let imgsFinales = [...imgsOriginales];
      if (imagenes.length > 0) {
        imgsFinales = [];
        for (let img of imagenes) {
          const url = await subirArchivo(img);
          if (url) imgsFinales.push(url);
        }
      }

      // Video
      let videoFinal = videoOriginal;
      if (video) videoFinal = await subirArchivo(video);

      // Categorías
      const categoriasObj = categorias.reduce((acc,c) => ({ ...acc, [c.nombre]: c.contenido }), {});

      // Actualizar en BD
      const { error } = await supabase.from("articulos_articulo").update({
        titulo,
        tipo,
        resumen,
        esTop: destacado,
        imagenes: imgsFinales.join(","),
        gameplay: videoFinal,
        ...categoriasObj
      }).eq("id", id);

      if (error) { console.error(error); alert("Error al actualizar artículo"); setCargando(false); return; }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
    setCargando(false);
  };

  return (
    <div className="upload-bg">
      <div className="upload-container">
        <h2 className="upload-title">Editar Artículo</h2>

        {/* Título */}
        <div className="field">
          <label>Título:</label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>

        {/* Tipo */}
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

        {/* Resumen */}
        <div className="field">
          <label>Resumen:</label>
          <textarea rows="4" value={resumen} onChange={(e) => setResumen(e.target.value)} />
        </div>

        {/* Destacado */}
        <div className="field">
          <label>
            <input type="checkbox" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} />
            &nbsp;Artículo destacado
          </label>
        </div>

        {/* Imágenes */}
        <div className="field">
          <label>Imágenes actuales:</label>
          <div className="img-row">
            {imgsOriginales.map((src,i)=> <img key={i} src={src} className="preview-img" />)}
          </div>
          <label>Nuevas imágenes (opcional):</label>
          <input type="file" accept="image/*" multiple onChange={(e)=>{setImagenes(e.target.files); handleImgPreview(e.target.files);}} />
          {previewImgs.map((src,i)=> <img key={i} src={src} className="preview-img" />)}
        </div>

        {/* Video */}
        <div className="field">
          <label>Gameplay actual:</label>
          {videoOriginal && <video src={videoOriginal} className="preview-video" controls />}
          <label>Nuevo video (opcional):</label>
          <input type="file" accept="video/*" onChange={(e)=>{setVideo(e.target.files[0]); handleVideoPreview(e.target.files[0]);}} />
          {previewVideo && <video src={previewVideo} className="preview-video" controls />}
        </div>

        {/* Categorías */}
        <button className="add-cat-btn" onClick={agregarCategoria}>+ Agregar categoría</button>
        <br /><br />
        {categorias.map((cat,i)=> (
          <div className="category-box" key={i}>
            <button className="remove-cat-btn" onClick={()=>eliminarCategoria(i)}>X</button>
            <div className="category-fields">
              <select value={cat.nombre} onChange={(e)=>actualizarCategoria(i,"nombre",e.target.value)}>
                <option value="">Selecciona categoría</option>
                <option value="guias">Guías</option>
                <option value="historia">Historia</option>
                <option value="noticias">Noticias</option>
                <option value="opiniones">Opiniones</option>
                <option value="curiosidades">Curiosidades</option>
                <option value="memes">Memes</option>
                <option value="eventos">Eventos</option>
              </select>
              <textarea rows="3" value={cat.contenido} onChange={(e)=>actualizarCategoria(i,"contenido",e.target.value)} />
            </div>
          </div>
        ))}

        {/* Botón final */}
        <br />
        <br />
        <br />
        <button className="btn-submit" disabled={cargando} onClick={actualizarArticulo}>
          {cargando ? "Cargando..." : "Actualizar artículo"}
        </button>
      </div>
    </div>
  );
}

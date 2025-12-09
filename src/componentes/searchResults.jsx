import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import "../css/searchResults.css";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get("q") || "";
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResultados = async () => {
      setLoading(true);
      // Buscar artículos donde el título contenga la palabra clave
      const { data, error } = await supabase
        .from("articulos_articulo")
        .select("*")
        .ilike("titulo", `%${searchTerm}%`);

      if (!error) {
        setResultados(data || []);
      } else {
        console.error(error);
        setResultados([]);
      }
      setLoading(false);
    };

    if (searchTerm.trim() !== "") {
      fetchResultados();
    } else {
      setResultados([]);
      setLoading(false);
    }
  }, [searchTerm]);

  if (loading) return <p>Cargando resultados...</p>;

  return (
    <div className="search-results-container">
      <h2>Resultados de búsqueda para: "{searchTerm}"</h2>

      {resultados.length === 0 ? (
        <p>No se encontraron artículos.</p>
      ) : (
        <ul className="search-results-list">
          {resultados.map(a => (
            <li
              key={a.id}
              className="search-result-item"
              onClick={() => navigate(`/articulo/${a.id}`)}
            >
              {a.imagenes && (
                <div className="search-result-img-wrapper">
                  <img
                    src={a.imagenes}
                    alt={a.titulo}
                    className="search-result-img"
                  />
                </div>
              )}
              <div className="search-result-title">{a.titulo}</div>
              <div className="search-result-type">{a.tipo}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;

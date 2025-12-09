import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import "../css/editarModal.css";

export default function EliminarArticuloModal({ articulo, onClose, onDeleted }) {
  const [cargando, setCargando] = useState(false);

  const eliminarArticulo = async () => {
    setCargando(true);
    try {
      const { error } = await supabase
        .from("articulos_articulo")
        .delete()
        .eq("id", articulo.id);

      if (error) {
        alert("Error al eliminar el artículo");
        setCargando(false);
        return;
      }

      onDeleted();
      onClose();
    } catch (err) {
      console.error(err);
      setCargando(false);
    }
  };

  return (
    <div className="editar-modal-bg">
      <div className="editar-modal">
        <h2>Eliminar Artículo</h2>
        <p>¿Estás seguro que deseas eliminar <strong>{articulo.titulo}</strong>?</p>

        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn" disabled={cargando}>
            Cancelar
          </button>
          <button onClick={eliminarArticulo} className="remove-cat-btn" disabled={cargando}>
            {cargando ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

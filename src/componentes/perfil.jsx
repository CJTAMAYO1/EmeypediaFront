import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import "../css/perfil.css";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    foto: "",
    username: "",
    bio: "",
    isPrivate: true,
  });
  const [newFoto, setNewFoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Obtener usuario y perfil
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: sessionData } = await supabase.auth.getUser();
      const currentUser = sessionData?.user;
      setUser(currentUser);

      if (currentUser) {
        const { data, error } = await supabase
          .from("usuarios_profile")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (!error && data) {
          setProfile({
            foto: data.foto || "",
            username: data.username || "",
            bio: data.bio || "",
            isPrivate: data.isPrivate ?? true,
          });
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  // Subir foto a Supabase Storage
  const subirFoto = async (file) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from("fotos_perfil")
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.error("Error al subir foto:", error);
      return null;
    }

    const { data } = supabase.storage.from("fotos_perfil").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMsg("");
    try {
      let fotoUrl = profile.foto;

      if (newFoto) {
        const uploadedUrl = await subirFoto(newFoto);
        if (uploadedUrl) fotoUrl = uploadedUrl;
      }

      const { error } = await supabase
        .from("usuarios_profile")
        .update({
          foto: fotoUrl,
          username: profile.username,
          bio: profile.bio,
          isPrivate: profile.isPrivate,
        })
        .eq("id", user.id);

      if (error) {
        console.error(error);
        setStatusMsg("Error al guardar cambios.");
      } else {
        setProfile((prev) => ({ ...prev, foto: fotoUrl }));
        setNewFoto(null);
        setStatusMsg("Perfil actualizado con éxito!");
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("Error inesperado al guardar cambios.");
    }
    setSaving(false);
  };

  if (loading) return <p style={{ textAlign: "center" }}>Cargando perfil...</p>;
  if (!user) return <p style={{ textAlign: "center" }}>Debes iniciar sesión para ver tu perfil.</p>;

  return (
    <div className="perfil-container">
      <div className="perfil-box">
        <h2>Mi Perfil</h2>

        {/* Foto de perfil */}
        <label>Foto de perfil:</label>
        <div className="perfil-foto-preview">
          {newFoto ? (
            <img src={URL.createObjectURL(newFoto)} alt="Nueva foto" className="foto-perfil" />
          ) : profile.foto ? (
            <img src={profile.foto} alt="Foto de perfil" className="foto-perfil" />
          ) : (
            <div className="foto-perfil foto-perfil-placeholder">Sin foto</div>
          )}
        </div>

        {/* Botón cambiar foto */}
        <button
          type="button"
          className="btn-cambiar-foto"
          onClick={() => document.getElementById("fileInput").click()}
        >
          Cambiar foto
        </button>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => setNewFoto(e.target.files[0])}
        />

        {/* Nombre de usuario */}
        <label>Nombre de usuario:</label>
        <input
          type="text"
          value={profile.username}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, username: e.target.value }))
          }
        />

        {/* Bio */}
        <label>Bio:</label>
        <textarea
          rows="4"
          value={profile.bio}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, bio: e.target.value }))
          }
        />

        {/* Cuenta privada */}
        <div className="switch-container">
          <input
            type="checkbox"
            checked={profile.isPrivate}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, isPrivate: e.target.checked }))
            }
          />
          <label>Cuenta privada</label>
        </div>

        {/* Botón guardar */}
        <button className="btn-guardar" onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>

        {statusMsg && <p className="estado-msg">{statusMsg}</p>}
      </div>
    </div>
  );
}

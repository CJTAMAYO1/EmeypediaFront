// services/storage.js (ejemplo)
import { supabase } from "../supabaseClient";

/**
 * Sube un archivo al bucket 'avatars' en la ruta userId/filename
 * devuelve { publicUrl, path } (si bucket privado devuelve signedUrl)
 */
export async function uploadProfileImage(userId, file) {
  if (!userId) throw new Error("User ID requerido");
  if (!file) throw new Error("Archivo requerido");

  const fileExt = file.name.split('.').pop();
  const fileName = `avatar.${fileExt}`; // puedes personalizar
  const filePath = `${userId}/${Date.now()}-${fileName}`;

  // Subir al bucket 'avatars'
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  // Si el bucket es público:
  const { data: publicData } = supabase
    .storage
    .from("avatars")
    .getPublicUrl(uploadData.path);

  const publicUrl = publicData?.publicUrl;

  // Si el bucket es privado y prefieres signed URL:
  // const { data: signed } = await supabase
  //   .storage
  //   .from("avatars")
  //   .createSignedUrl(uploadData.path, 60 * 60); // 1 hora
  // const signedUrl = signed?.signedUrl;

  return { path: uploadData.path, publicUrl }; // o return { path, signedUrl } si usas privado
}

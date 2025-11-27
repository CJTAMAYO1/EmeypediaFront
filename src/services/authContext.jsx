import { createContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  // 📌 Subir imagen al bucket avatars
  const uploadAvatar = async (userId, file) => {
  if (!file) return null;

  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}.${fileExt}`; // ⬅️ ARREGLADO

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: publicUrl } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  return publicUrl?.publicUrl ?? null;
};

  const signIn = async (identifier, password) => {
    const { data: maybeUser } = await supabase
      .from("usuarios_profile")
      .select("email, username")
      .eq("username", identifier)
      .maybeSingle();

    const emailOrUser = maybeUser?.email ?? identifier;

    const { error } = await supabase.auth.signInWithPassword({
      email: emailOrUser,
      password,
    });

    if (error) throw error;

    return { ok: true };
  };

  // 📌 Crear cuenta con AVATAR
  const signUp = async (email, password, username, file = null, bio = "") => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) throw error;

    const userId = data?.user?.id;
    if (!userId) return { ok: true, pendingVerification: true };

    // 📌 Subimos la foto y guardamos su URL
    let foto = null;
    if (file) {
      foto = await uploadAvatar(userId, file);
    }

    const { error: upsertErr } = await supabase
      .from("usuarios_profile")
      .upsert(
        {
          id: userId,
          username,
          bio,
          email,
          foto,
          rol: "user",
        },
        { onConflict: "id" }
      );

    if (upsertErr) throw upsertErr;

    return { ok: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/navbar.css";
import logo from "../assets/logo.png";
import { supabase } from "../services/supabaseClient";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";

export const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscar:", searchQuery);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <a href="/" className="brand" aria-label="Emeypedia home">
            <img src="/assets/Emeyce_SS_LOGO.png" alt="Emeypedia logo" className="nav-logo" />
            <span className="brand-text">Emeypedia</span>
          </a>
        </div>

        <div className="navbar-center" role="search" aria-label="Buscar en Emeypedia">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="search"
              className="search-input"
              placeholder="Buscar artículos, usuarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar"
            />
            <button type="submit" className="nav-btn search-btn">Buscar</button>
          </form>
        </div>

        <div className="navbar-right">
          {!user ? (
            <>
              <button className="nav-btn" onClick={() => setShowLogin(true)}>Iniciar sesión</button>
              <button className="nav-btn register-btn" onClick={() => setShowRegister(true)}>Crear cuenta</button>
            </>
          ) : (
            <>
              <button className="nav-btn" onClick={() => navigate("/dashboard")}>Perfil</button>
              <button className="nav-btn logout-btn" onClick={handleLogout}>Cerrar sesión</button>
            </>
          )}
        </div>
      </nav>

      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} openSignup={() => { setShowLogin(false); setShowRegister(true); }} />
      <RegisterModal show={showRegister} onClose={() => setShowRegister(false)} />
    </>
  );
};
export default Navbar;
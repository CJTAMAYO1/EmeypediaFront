import React, { useEffect, useState } from "react";
import "../css/navbar.css";
import logo from "../assets/logo.png";
import { supabase } from "../services/supabaseClient";

const Footer = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleProtectedClick = (e) => {
    e.preventDefault();
    alert("Por favor inicia sesión para ver tus artículos");
    window.location.href = "/login";
  };

  return (
    <footer
      className="footer"
      style={{
        background: "linear-gradient(to right, #1f1c2c, #77709b)",
        color: "#fff",
        padding: "24px 0",
        marginTop: "auto",
      }}
    >
      <div
        className="footer-container"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}
      >
        <div
          className="footer-row"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <div
            className="footer-col"
            style={{ flex: "1 1 200px", display: "flex", alignItems: "center", gap: 10 }}
          >
            <a href="/" className="brand" aria-label="Emeypedia home">
              <img src={logo} 
              alt="Logo"
              style={{ width: "100px", height: "auto" }} />
              <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>EMEYPEDIA</span>
              </a>
          </div>

          <div className="footer-col" style={{ flex: "1 1 200px", textAlign: "center" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <a href="/contact" style={{ color: "#fff", textDecoration: "none" }}>
                  Contáctanos
                </a>
              </li>
              <li>
                <a href="/about" style={{ color: "#fff", textDecoration: "none" }}>
                  ¿Quiénes somos?
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col" style={{ flex: "1 1 200px", textAlign: "right" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <a href="/terms" style={{ color: "#fff", textDecoration: "none" }}>
                  Términos y Condiciones
                </a>
              </li>
              {user ? (
                <li>
                  <a href="/profile" style={{ color: "#fff", textDecoration: "none" }}>
                    Tus artículos
                  </a>
                </li>
              ) : (
                <li>
                  <a
                    href="/login"
                    onClick={handleProtectedClick}
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    Tus artículos
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <span style={{ fontWeight: 300 }}>© 2025 EMEYPEDIA. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
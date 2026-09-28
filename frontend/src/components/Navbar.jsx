import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Gamepad2, Calendar, Heart, Shield, LogOut, LogIn, UserPlus, Info, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-header">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <Gamepad2 size={28} className="nav-logo-icon" />
          <span className="gradient-accent-text">GamerFest</span>
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`nav-menu-content ${isMenuOpen ? 'open' : ''}`}>
        <ul className="nav-links">
          <li>
            <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <Gamepad2 size={18} />
              Lanzamientos
            </NavLink>
          </li>
          <li>
            <NavLink to="/calendar" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <Calendar size={18} />
              Calendario
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <Info size={18} />
              Acerca de
            </NavLink>
          </li>

          {user && (
            <li>
              <NavLink to="/favorites" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <Heart size={18} />
                Favoritos
              </NavLink>
            </li>
          )}

          {user && user.role === 'ROL_ADMIN' && (
            <li>
              <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <Shield size={18} />
                Administración
              </NavLink>
            </li>
          )}
        </ul>

        <div className="nav-auth-actions">
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <div style={{
                  background: 'var(--bg-tertiary)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}>
                  @{user.username}
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                <LogOut size={16} />
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                <LogIn size={16} />
                Entrar
              </Link>
              <Link to="/register" onClick={closeMenu} className="btn btn-primary" style={{ padding: '8px 16px' }}>
                <UserPlus size={16} />
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

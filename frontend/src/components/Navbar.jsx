import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Gamepad2, Calendar, Heart, Shield, LogOut, LogIn, UserPlus, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Gamepad2 size={28} className="nav-logo-icon" />
        <span className="gradient-accent-text">GamerFest</span>
      </Link>

      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Gamepad2 size={18} />
            Lanzamientos
          </NavLink>
        </li>
        <li>
          <NavLink to="/calendar" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Calendar size={18} />
            Calendario
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Info size={18} />
            Acerca de
          </NavLink>
        </li>

        {user && (
          <li>
            <NavLink to="/favorites" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <Heart size={18} />
              Favoritos
            </NavLink>
          </li>
        )}

        {user && user.role === 'ROL_ADMIN' && (
          <li>
            <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <Shield size={18} />
              Administración
            </NavLink>
          </li>
        )}
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
            <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px' }}>
              <LogIn size={16} />
              Entrar
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px' }}>
              <UserPlus size={16} />
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

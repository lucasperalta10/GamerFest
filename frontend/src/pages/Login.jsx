import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Key, Mail } from 'lucide-react';
import { useApp, API_URL } from '../context/AppContext';

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailOrUsername, password })
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        navigate('/');
      } else {
        setError(data.message || 'Credenciales incorrectas.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container glass-panel">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <LogIn size={40} style={{ color: 'var(--accent-purple)', marginBottom: '10px' }} />
        <h2 className="gradient-text" style={{ fontSize: '1.8rem' }}>Iniciar Sesión</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
          Ingresa para guardar tus videojuegos y eventos favoritos.
        </p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#f87171',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          fontSize: '0.9rem',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Usuario o Correo Electrónico</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="form-control"
              placeholder="gamer123 o gamer@gmail.com"
              style={{ paddingLeft: '40px' }}
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '30px' }}>
          <label className="form-label">Contraseña</label>
          <div style={{ position: 'relative' }}>
            <Key size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="••••••••"
              style={{ paddingLeft: '40px' }}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px' }}
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        ¿No tienes cuenta?{' '}
        <Link to="/register" style={{ color: 'var(--accent-purple)', fontWeight: '600' }}>
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
}

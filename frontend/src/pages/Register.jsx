import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Key, Mail, User } from 'lucide-react';
import { useApp, API_URL } from '../context/AppContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        navigate('/');
      } else {
        setError(data.message || 'Error al registrar usuario.');
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
        <UserPlus size={40} style={{ color: 'var(--accent-purple)', marginBottom: '10px' }} />
        <h2 className="gradient-text" style={{ fontSize: '1.8rem' }}>Crear Cuenta</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
          Únete a la comunidad de GamerFest y guarda tus favoritos.
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
          <label className="form-label">Nombre de Usuario</label>
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              placeholder="gamer123"
              style={{ paddingLeft: '40px' }}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Correo Electrónico</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="gamer@gmail.com"
              style={{ paddingLeft: '40px' }}
              required
            />
          </div>
        </div>

        <div className="form-group">
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

        <div className="form-group" style={{ marginBottom: '30px' }}>
          <label className="form-label">Confirmar Contraseña</label>
          <div style={{ position: 'relative' }}>
            <Key size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" style={{ color: 'var(--accent-purple)', fontWeight: '600' }}>
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
}

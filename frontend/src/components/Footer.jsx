import React from 'react';
import { Gamepad2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '30px 20px',
      textAlign: 'center',
      marginTop: 'auto',
      fontSize: '0.9rem',
      color: 'var(--text-muted)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
        <Gamepad2 size={20} style={{ color: 'var(--accent-purple)' }} />
        <span className="gradient-accent-text" style={{ fontWeight: '700', fontFamily: 'var(--font-heading)' }}>GamerFest</span>
      </div>
      <p>© {new Date().getFullYear()} GamerFest MVP. Todos los derechos reservados.</p>
      <p style={{ fontSize: '0.75rem', marginTop: '6px' }}>Plataforma centralizada de lanzamientos y eventos de videojuegos.</p>
    </footer>
  );
}

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  // Cerrar al presionar Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{
          border: '1px solid var(--border-hover)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), var(--shadow-glow)',
          animation: 'modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '16px',
          marginBottom: '20px'
        }}>
          <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.4rem' }}>{title}</h2>
          <button 
            onClick={onClose} 
            className="btn btn-secondary" 
            style={{
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px' }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

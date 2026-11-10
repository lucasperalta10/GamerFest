import React from 'react';
import { Heart, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function GameCard({ game, onDetailClick }) {
  const { user, isGameFavorite, toggleGameFavorite } = useApp();

  const handleFavorite = (e) => {
    e.stopPropagation(); // Evitar que el clic en el botón abra los detalles
    toggleGameFavorite(game.id);
  };

  const isFav = isGameFavorite(game.id);

  // Formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString + 'T00:00:00'); // Evitar problemas de zona horaria local
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="card glass-panel" onClick={() => onDetailClick(game)} style={{ cursor: 'pointer' }}>
      <div className="card-img-wrapper">
        <img
          src={game.image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop'}
          alt={game.title}
          className="card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop';
          }}
        />
        <div className="card-badge">Lanzamiento</div>
        {user && (
          <button
            className={`card-fav-btn ${isFav ? 'active' : ''}`}
            onClick={handleFavorite}
            title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart size={18} fill={isFav ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <div className="card-content">
        <h3 className="card-title">{game.title}</h3>
        <p className="card-desc">{game.description}</p>
        
        <div className="card-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} style={{ color: 'var(--accent-purple)' }} />
            <span>{formatDate(game.release_date)}</span>
          </div>

          <div className="card-platforms">
            {game.platforms && game.platforms.map(p => (
              <span key={p.id} className="platform-tag">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

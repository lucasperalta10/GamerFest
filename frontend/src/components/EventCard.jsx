import React from 'react';
import { Heart, Calendar, Link as LinkIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function EventCard({ event, onDetailClick }) {
  const { user, isEventFavorite, toggleEventFavorite } = useApp();

  const handleFavorite = (e) => {
    e.stopPropagation(); // Evitar que el clic en el botón abra los detalles
    toggleEventFavorite(event.id);
  };

  const isFav = isEventFavorite(event.id);

  // Formatear la fecha y hora
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' hs';
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'showcase': return 'Showcase';
      case 'conferencia': return 'Conferencia';
      case 'premiacion': return 'Premiación';
      case 'lanzamiento': return 'Lanzamiento';
      default: return 'Otro';
    }
  };

  const getTypeClass = (type) => {
    return `event-type-${type || 'otro'}`;
  };

  return (
    <div className="card glass-panel" onClick={() => onDetailClick(event)} style={{ cursor: 'pointer' }}>
      <div className="card-img-wrapper">
        <img
          src={event.image_url || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop'}
          alt={event.title}
          className="card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop';
          }}
        />
        <div className={`card-badge ${getTypeClass(event.type)}`} style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
          {getTypeLabel(event.type)}
        </div>
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
        <h3 className="card-title">{event.title}</h3>
        <p className="card-desc">{event.description}</p>
        
        <div className="card-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span>{formatDateTime(event.event_date)}</span>
          </div>

          {event.location_link && (
            <a
              href={event.location_link}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={(e) => e.stopPropagation()} // Detener propagación
            >
              <LinkIcon size={12} />
              Enlace
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

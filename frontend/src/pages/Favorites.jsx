import React, { useState } from 'react';
import { Heart, Gamepad, Calendar, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GameCard from '../components/GameCard';
import EventCard from '../components/EventCard';
import Modal from '../components/Modal';

export default function Favorites() {
  const { favorites } = useApp();
  const [activeTab, setActiveTab] = useState('games'); // 'games' | 'events'
  
  // Detalle Modal
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailType, setDetailType] = useState('game'); // 'game' | 'event'

  const handleOpenGameDetail = (game) => {
    setSelectedDetail(game);
    setDetailType('game');
  };

  const handleOpenEventDetail = (event) => {
    setSelectedDetail(event);
    setDetailType('event');
  };

  // Formateadores de fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Por anunciar (TBA)';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' hs';
  };

  return (
    <div>
      <header className="page-header">
        <h1 className="gradient-text page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Heart size={36} fill="var(--accent-pink)" style={{ color: 'var(--accent-pink)' }} />
          Mis Favoritos
        </h1>
        <p className="page-subtitle">Accede rápidamente a tus videojuegos y eventos guardados.</p>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '30px' }}>
        <button
          onClick={() => setActiveTab('games')}
          className={`btn ${activeTab === 'games' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Gamepad size={18} />
          Videojuegos ({favorites.games.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Calendar size={18} />
          Eventos ({favorites.events.length})
        </button>
      </div>

      {/* Listados */}
      {activeTab === 'games' ? (
        favorites.games.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No tienes ningún videojuego guardado en tus favoritos todavía.
          </div>
        ) : (
          <div className="grid">
            {favorites.games.map(game => (
              <GameCard
                key={game.id}
                game={game}
                onDetailClick={handleOpenGameDetail}
              />
            ))}
          </div>
        )
      ) : (
        favorites.events.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No tienes ningún evento guardado en tus favoritos todavía.
          </div>
        ) : (
          <div className="grid">
            {favorites.events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onDetailClick={handleOpenEventDetail}
              />
            ))}
          </div>
        )
      )}

      {/* Modal de Detalle */}
      <Modal
        isOpen={selectedDetail !== null}
        onClose={() => setSelectedDetail(null)}
        title={selectedDetail ? selectedDetail.title : ''}
      >
        {selectedDetail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <img
              src={selectedDetail.image_url || (detailType === 'game' ? 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop')}
              alt={selectedDetail.title}
              style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
            />
            
            <div>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Descripción
              </h4>
              <p style={{ color: 'var(--text-primary)', fontSize: '1rem', whiteSpace: 'pre-line' }}>{selectedDetail.description || 'Sin descripción disponible.'}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <div>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  {detailType === 'game' ? 'Fecha de Lanzamiento' : 'Fecha y Hora'}
                </h4>
                <p style={{ fontWeight: '600' }}>
                  {detailType === 'game' ? formatDate(selectedDetail.release_date) : formatDateTime(selectedDetail.event_date)}
                </p>
              </div>

              <div>
                {detailType === 'game' ? (
                  <>
                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      Plataformas
                    </h4>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {selectedDetail.platforms && selectedDetail.platforms.map(p => (
                        <span key={p.id} className="platform-tag" style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      Tipo de Evento
                    </h4>
                    <p style={{ textTransform: 'capitalize', fontWeight: '600', color: selectedDetail.type === 'showcase' ? 'var(--accent-purple)' : selectedDetail.type === 'conferencia' ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                      {selectedDetail.type}
                    </p>
                  </>
                )}
              </div>
            </div>

            {detailType === 'event' && selectedDetail.location_link && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', textAlign: 'center' }}>
                <a
                  href={selectedDetail.location_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <ExternalLink size={16} />
                  Ver Transmisión / Sitio Oficial
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

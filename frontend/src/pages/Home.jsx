import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Gamepad, Calendar, ExternalLink } from 'lucide-react';
import { API_URL } from '../context/AppContext';
import GameCard from '../components/GameCard';
import EventCard from '../components/EventCard';
import Modal from '../components/Modal';

export default function Home() {
  const [games, setGames] = useState([]);
  const [events, setEvents] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  
  // Filtros
  const [searchGame, setSearchGame] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [searchEvent, setSearchEvent] = useState('');

  // Detalles Modals
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailType, setDetailType] = useState('game'); // 'game' | 'event'

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [searchGame, selectedPlatform, searchEvent]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener plataformas
      const platRes = await fetch(`${API_URL}/games/platforms`);
      if (platRes.ok) {
        const platData = await platRes.ok ? await platRes.json() : [];
        setPlatforms(platData);
      }

      // Obtener videojuegos
      let gameQuery = '';
      const params = [];
      if (searchGame) params.push(`search=${searchGame}`);
      if (selectedPlatform) params.push(`platform=${selectedPlatform}`);
      if (params.length > 0) gameQuery = `?${params.join('&')}`;

      const gameRes = await fetch(`${API_URL}/games${gameQuery}`);
      const gameData = gameRes.ok ? await gameRes.json() : [];
      setGames(gameData);

      // Obtener eventos
      let eventQuery = '';
      if (searchEvent) eventQuery = `?search=${searchEvent}`;

      const eventRes = await fetch(`${API_URL}/events${eventQuery}`);
      const eventData = eventRes.ok ? await eventRes.json() : [];
      setEvents(eventData);
    } catch (error) {
      console.error('Error al obtener datos en Home:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGameDetail = (game) => {
    setSelectedDetail(game);
    setDetailType('game');
  };

  const handleOpenEventDetail = (event) => {
    setSelectedDetail(event);
    setDetailType('event');
  };

  // Formateo de fechas para detalles
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
      {/* Hero Header */}
      <header className="page-header" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)', padding: '60px 20px', background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', border: '1px solid var(--border-color)', marginBottom: '50px' }}>
        <h1 className="gradient-accent-text" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '16px' }}>
          GamerFest MVP
        </h1>
        <p className="page-subtitle" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem' }}>
          Tu calendario y listado centralizado de la industria de los videojuegos. Consulta lanzamientos, eventos y conferencias clave en un solo lugar.
        </p>
      </header>

      {/* Grid General */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '50px' }}>
        
        {/* Sección de Videojuegos */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 className="gradient-text" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.8rem' }}>
              <Gamepad size={28} style={{ color: 'var(--accent-purple)' }} />
              Próximos Lanzamientos
            </h2>
          </div>

          {/* Filtros de Videojuegos */}
          <div className="filter-section glass-panel" style={{ padding: '16px', background: 'var(--bg-secondary)', marginBottom: '24px' }}>
            <div className="search-input-wrapper">
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Buscar videojuegos por título..."
                value={searchGame}
                onChange={(e) => setSearchGame(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '40px' }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px' }}>
              <SlidersHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="form-control"
                style={{ cursor: 'pointer' }}
              >
                <option value="">Todas las plataformas</option>
                {platforms.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Cargando videojuegos...</p>
          ) : games.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No se encontraron videojuegos que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="grid">
              {games.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  onDetailClick={handleOpenGameDetail}
                />
              ))}
            </div>
          )}
        </section>

        {/* Sección de Eventos */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 className="gradient-text" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.8rem' }}>
              <Calendar size={28} style={{ color: 'var(--accent-cyan)' }} />
              Próximos Eventos & Showcases
            </h2>
          </div>

          {/* Filtro de Eventos */}
          <div className="filter-section glass-panel" style={{ padding: '16px', background: 'var(--bg-secondary)', marginBottom: '24px' }}>
            <div className="search-input-wrapper">
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Buscar eventos por título..."
                value={searchEvent}
                onChange={(e) => setSearchEvent(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Cargando eventos...</p>
          ) : events.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No se encontraron eventos programados.
            </div>
          ) : (
            <div className="grid">
              {events.slice(0, 6).map(event => ( // Limitar a los 6 más próximos en Home
                <EventCard
                  key={event.id}
                  event={event}
                  onDetailClick={handleOpenEventDetail}
                />
              ))}
            </div>
          )}
        </section>

      </div>

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

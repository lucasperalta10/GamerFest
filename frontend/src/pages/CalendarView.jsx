import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Filter, Gamepad, Calendar as CalendarIcon, ExternalLink, Search, LayoutGrid, List } from 'lucide-react';
import { API_URL } from '../context/AppContext';
import Modal from '../components/Modal';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // Iniciamos en Junio 2026 (mes 5 en JS) para alinearnos con los datos del seeder
  const [events, setEvents] = useState([]);
  const [games, setGames] = useState([]);
  const [filterType, setFilterType] = useState('todos'); // 'todos' | 'showcase' | 'conferencia' | 'premiacion' | 'lanzamiento' | 'juego'
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640 ? 'list' : 'grid');
  
  // Detalle Modal
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailType, setDetailType] = useState('game'); // 'game' | 'event'

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (Enero = 0, Diciembre = 11)

  useEffect(() => {
    fetchMonthData();
  }, [currentDate]);

  const fetchMonthData = async () => {
    try {
      // Eventos del mes (Backend usa 1-indexed, de modo que mes + 1)
      const eventRes = await fetch(`${API_URL}/events?year=${year}&month=${month + 1}`);
      const eventData = eventRes.ok ? await eventRes.json() : [];
      setEvents(eventData);

      // Traer todos los juegos para filtrar localmente los de este mes
      const gameRes = await fetch(`${API_URL}/games`);
      const gameData = gameRes.ok ? await gameRes.json() : [];
      setGames(gameData);
    } catch (error) {
      console.error('Error al obtener datos del calendario:', error);
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // Obtener días del mes y compensación del día de la semana
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => {
    const day = new Date(y, m, 1).getDay();
    // Ajustar para que Lunes sea el primer día (0) y Domingo sea el último (6)
    return day === 0 ? 6 : day - 1;
  };

  const totalDays = getDaysInMonth(year, month);
  const offset = getFirstDayOfMonth(year, month);

  // Generar lista de días
  const dayCells = [];
  // Celdas vacías del principio
  for (let i = 0; i < offset; i++) {
    dayCells.push({ empty: true });
  }
  // Celdas de días reales
  for (let d = 1; d <= totalDays; d++) {
    const dayDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    
    // Filtrar eventos de este día
    const dayEvents = events.filter(e => {
      const eventDate = new Date(e.event_date);
      // Ajustar zona horaria a la fecha local del evento
      const evY = eventDate.getUTCFullYear();
      const evM = eventDate.getUTCMonth();
      const evD = eventDate.getUTCDate();
      return evY === year && evM === month && evD === d;
    });

    // Filtrar lanzamientos de juegos de este día
    const dayGames = games.filter(g => {
      if (!g.release_date) return false;
      const [gY, gM, gD] = g.release_date.split('-').map(Number);
      return gY === year && gM === (month + 1) && gD === d;
    });

    dayCells.push({
      empty: false,
      dayNum: d,
      dateStr: dayDateStr,
      events: dayEvents,
      games: dayGames
    });
  }

  const handleOpenDetail = (item, type) => {
    setSelectedDetail(item);
    setDetailType(type);
  };

  // Nombres de meses en español
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const fullDaysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Formateadores de fecha para detalle modal
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

  // Filtrar celda y sus contenidos según query y tipo
  const filterCellItems = (cell) => {
    if (cell.empty) return { events: [], games: [] };

    const showEvents = filterType === 'todos' || 
      (filterType !== 'juego' && filterType === cell.events[0]?.type) ||
      cell.events.some(e => e.type === filterType);
      
    const showGames = filterType === 'todos' || filterType === 'juego';
    const query = searchQuery.trim().toLowerCase();

    const filteredEvents = (showEvents ? cell.events.filter(e => filterType === 'todos' || e.type === filterType) : [])
      .filter(e => !query || e.title.toLowerCase().includes(query) || (e.description && e.description.toLowerCase().includes(query)));

    const filteredGames = (showGames ? cell.games : [])
      .filter(g => !query || g.title.toLowerCase().includes(query) || (g.description && g.description.toLowerCase().includes(query)));

    return { filteredEvents, filteredGames };
  };

  return (
    <div>
      <header className="page-header">
        <h1 className="gradient-text page-title">Calendario de la Industria</h1>
        <p className="page-subtitle">Explora conferencias, showcases y lanzamientos programados mes a mes.</p>
      </header>

      {/* Controles de Navegación y Filtros */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Cambiador de Mes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={prevMonth} className="btn btn-secondary" style={{ padding: '8px' }}>
            <ChevronLeft size={20} />
          </button>
          <h2 style={{ minWidth: '180px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            {monthNames[month]} {year}
          </h2>
          <button onClick={nextMonth} className="btn btn-secondary" style={{ padding: '8px' }}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Búsqueda, Filtros y Toggle Vista */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '200px', flex: '1' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar evento o juego..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '36px', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-control"
              style={{ width: '160px', fontSize: '0.9rem' }}
            >
              <option value="todos">Todos los eventos</option>
              <option value="showcase">Solo Showcases</option>
              <option value="conferencia">Solo Conferencias</option>
              <option value="premiacion">Solo Premiaciones</option>
              <option value="lanzamiento">Lanzamientos de Evento</option>
              <option value="juego">Lanzamientos de Juegos</option>
            </select>
          </div>

          {/* Toggle de Modo de Vista (Grilla vs Lista) */}
          <div className="view-mode-toggle" style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}
              title="Vista Grilla"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}
              title="Vista Lista / Agenda"
            >
              <List size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* VISTA GRILLA */}
      {viewMode === 'grid' ? (
        <div className="calendar-grid">
          {/* Encabezados de días */}
          {daysOfWeek.map((day, idx) => (
            <div key={idx} className="calendar-day-label">
              {day}
            </div>
          ))}

          {/* Celdas */}
          {dayCells.map((cell, idx) => {
            if (cell.empty) {
              return <div key={idx} className="calendar-day empty"></div>;
            }

            const { filteredEvents, filteredGames } = filterCellItems(cell);
            const today = new Date();
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === cell.dayNum;

            return (
              <div key={idx} className={`calendar-day ${isToday ? 'today' : ''}`}>
                <div className="calendar-day-num">{cell.dayNum}</div>
                
                <div className="calendar-events-container">
                  {filteredGames.map(game => (
                    <div
                      key={`g-${game.id}`}
                      className="calendar-event-item event-type-lanzamiento"
                      onClick={() => handleOpenDetail(game, 'game')}
                      title={`Lanzamiento: ${game.title}`}
                    >
                      🚀 {game.title}
                    </div>
                  ))}

                  {filteredEvents.map(event => (
                    <div
                      key={`e-${event.id}`}
                      className={`calendar-event-item event-type-${event.type}`}
                      onClick={() => handleOpenDetail(event, 'event')}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VISTA LISTA / AGENDA (Ideal para Mobile) */
        <div className="calendar-list-view" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {dayCells.filter(cell => !cell.empty).map((cell) => {
            const { filteredEvents, filteredGames } = filterCellItems(cell);
            if (filteredEvents.length === 0 && filteredGames.length === 0) {
              return null; // Omitir días sin eventos al filtrar en lista
            }

            const dateObj = new Date(year, month, cell.dayNum);
            const dayName = fullDaysOfWeek[dateObj.getDay()];
            const today = new Date();
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === cell.dayNum;

            return (
              <div
                key={`list-${cell.dayNum}`}
                className="glass-panel"
                style={{
                  padding: '16px 20px',
                  borderLeft: isToday ? '4px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  background: isToday ? 'rgba(6, 182, 212, 0.05)' : 'var(--bg-glass)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: isToday ? 'var(--accent-cyan)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{dayName} {cell.dayNum} de {monthNames[month]}</span>
                    {isToday && <span style={{ fontSize: '0.75rem', background: 'var(--accent-cyan)', color: '#000', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>HOY</span>}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filteredGames.map(game => (
                    <div
                      key={`list-g-${game.id}`}
                      onClick={() => handleOpenDetail(game, 'game')}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', color: '#fbbf24', fontSize: '0.95rem' }}>
                          🚀 {game.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Lanzamiento de juego
                        </div>
                      </div>
                      <span className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Ver detalle</span>
                    </div>
                  ))}

                  {filteredEvents.map(event => (
                    <div
                      key={`list-e-${event.id}`}
                      onClick={() => handleOpenDetail(event, 'event')}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        background: event.type === 'showcase' ? 'rgba(139, 92, 246, 0.1)' : event.type === 'conferencia' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${event.type === 'showcase' ? 'rgba(139, 92, 246, 0.3)' : event.type === 'conferencia' ? 'rgba(6, 182, 212, 0.3)' : 'var(--border-color)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          {event.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', textTransform: 'capitalize' }}>
                          Evento ({event.type})
                        </div>
                      </div>
                      <span className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Ver detalle</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {dayCells.filter(c => !c.empty).every(c => {
            const { filteredEvents, filteredGames } = filterCellItems(c);
            return filteredEvents.length === 0 && filteredGames.length === 0;
          }) && (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No hay eventos ni lanzamientos que coincidan con los filtros seleccionados para este mes.
            </div>
          )}
        </div>
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

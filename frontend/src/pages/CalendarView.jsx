import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Filter, Gamepad, Calendar as CalendarIcon, ExternalLink } from 'lucide-react';
import { API_URL } from '../context/AppContext';
import Modal from '../components/Modal';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // Iniciamos en Junio 2026 (mes 5 en JS) para alinearnos con los datos del seeder
  const [events, setEvents] = useState([]);
  const [games, setGames] = useState([]);
  const [filterType, setFilterType] = useState('todos'); // 'todos' | 'showcase' | 'conferencia' | 'premiacion' | 'lanzamiento' | 'juego'
  
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

        {/* Filtros */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-control"
            style={{ width: '200px' }}
          >
            <option value="todos">Todos los eventos</option>
            <option value="showcase">Solo Showcases</option>
            <option value="conferencia">Solo Conferencias</option>
            <option value="premiacion">Solo Premiaciones</option>
            <option value="lanzamiento">Lanzamientos de Evento</option>
            <option value="juego">Lanzamientos de Juegos</option>
          </select>
        </div>

      </div>

      {/* Grilla de Calendario */}
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

          // Filtrar items según el tipo de filtro seleccionado
          const showEvents = filterType === 'todos' || 
            (filterType !== 'juego' && filterType === cell.events[0]?.type) || // simplificación
            cell.events.some(e => e.type === filterType);
            
          const showGames = filterType === 'todos' || filterType === 'juego';

          const filteredEvents = showEvents ? cell.events.filter(e => filterType === 'todos' || e.type === filterType) : [];
          const filteredGames = showGames ? cell.games : [];

          // Determinar si hoy es esta celda
          const today = new Date();
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === cell.dayNum;

          return (
            <div key={idx} className={`calendar-day ${isToday ? 'today' : ''}`}>
              <div className="calendar-day-num">{cell.dayNum}</div>
              
              <div className="calendar-events-container">
                {/* Mostrar Lanzamientos de Juegos */}
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

                {/* Mostrar Eventos */}
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

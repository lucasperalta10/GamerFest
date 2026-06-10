import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Gamepad, Calendar, LayoutDashboard } from 'lucide-react';
import { useApp, API_URL } from '../context/AppContext';
import Modal from '../components/Modal';

export default function AdminDashboard() {
  const { user, token } = useApp();
  const navigate = useNavigate();

  // Redirigir si no es admin
  useEffect(() => {
    if (!user || user.role !== 'ROL_ADMIN') {
      navigate('/');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState('games'); // 'games' | 'events'
  const [games, setGames] = useState([]);
  const [events, setEvents] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  // Modals de CRUD
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Edit / Delete states
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteType, setDeleteType] = useState('game'); // 'game' | 'event'

  // Form states - Games
  const [gameTitle, setGameTitle] = useState('');
  const [gameDesc, setGameDesc] = useState('');
  const [gameReleaseDate, setGameReleaseDate] = useState('');
  const [gameImageUrl, setGameImageUrl] = useState('');
  const [gameSelectedPlatforms, setGameSelectedPlatforms] = useState([]); // Array de IDs

  // Form states - Events
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('otro');
  const [eventLocationLink, setEventLocationLink] = useState('');
  const [eventImageUrl, setEventImageUrl] = useState('');

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.role === 'ROL_ADMIN') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const gRes = await fetch(`${API_URL}/games`);
      const gData = gRes.ok ? await gRes.json() : [];
      setGames(gData);

      const eRes = await fetch(`${API_URL}/events`);
      const eData = eRes.ok ? await eRes.json() : [];
      setEvents(eData);

      const pRes = await fetch(`${API_URL}/games/platforms`);
      const pData = pRes.ok ? await pRes.json() : [];
      setPlatforms(pData);
    } catch (error) {
      console.error('Error al cargar datos en panel de administración:', error);
    }
  };

  // --- Handlers de Modals de Juego ---
  const openCreateGameModal = () => {
    setSelectedItem(null);
    setGameTitle('');
    setGameDesc('');
    setGameReleaseDate('');
    setGameImageUrl('');
    setGameSelectedPlatforms([]);
    setIsGameModalOpen(true);
  };

  const openEditGameModal = (game) => {
    setSelectedItem(game);
    setGameTitle(game.title);
    setGameDesc(game.description || '');
    setGameReleaseDate(game.release_date || '');
    setGameImageUrl(game.image_url || '');
    setGameSelectedPlatforms(game.platforms ? game.platforms.map(p => p.id) : []);
    setIsGameModalOpen(true);
  };

  const handleGameSubmit = async (e) => {
    e.preventDefault();
    if (!gameTitle) return;

    const gamePayload = {
      title: gameTitle,
      description: gameDesc,
      release_date: gameReleaseDate || null,
      image_url: gameImageUrl,
      platforms: gameSelectedPlatforms
    };

    const url = selectedItem ? `${API_URL}/games/${selectedItem.id}` : `${API_URL}/games`;
    const method = selectedItem ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(gamePayload)
      });

      if (res.ok) {
        setIsGameModalOpen(false);
        fetchData();
        setMessage(selectedItem ? 'Videojuego actualizado con éxito.' : 'Videojuego creado con éxito.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error al guardar videojuego:', error);
    }
  };

  const togglePlatformSelection = (id) => {
    setGameSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  // --- Handlers de Modals de Evento ---
  const openCreateEventModal = () => {
    setSelectedItem(null);
    setEventTitle('');
    setEventDesc('');
    setEventDate('');
    setEventType('otro');
    setEventLocationLink('');
    setEventImageUrl('');
    setIsEventModalOpen(true);
  };

  const openEditEventModal = (event) => {
    setSelectedItem(event);
    setEventTitle(event.title);
    setEventDesc(event.description || '');
    // Convertir fecha de ISO a datetime-local compatible format (YYYY-MM-DDThh:mm)
    const localDate = event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '';
    setEventDate(localDate);
    setEventType(event.type || 'otro');
    setEventLocationLink(event.location_link || '');
    setEventImageUrl(event.image_url || '');
    setIsEventModalOpen(true);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!eventTitle || !eventDate) return;

    const eventPayload = {
      title: eventTitle,
      description: eventDesc,
      event_date: new Date(eventDate).toISOString(),
      type: eventType,
      location_link: eventLocationLink,
      image_url: eventImageUrl
    };

    const url = selectedItem ? `${API_URL}/events/${selectedItem.id}` : `${API_URL}/events`;
    const method = selectedItem ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventPayload)
      });

      if (res.ok) {
        setIsEventModalOpen(false);
        fetchData();
        setMessage(selectedItem ? 'Evento actualizado con éxito.' : 'Evento creado con éxito.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error al guardar evento:', error);
    }
  };

  // --- Handlers de Modals de Eliminación ---
  const openDeleteConfirm = (item, type) => {
    setSelectedItem(item);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async () => {
    const url = deleteType === 'game' 
      ? `${API_URL}/games/${selectedItem.id}` 
      : `${API_URL}/events/${selectedItem.id}`;

    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setIsDeleteModalOpen(false);
        fetchData();
        setMessage(`${deleteType === 'game' ? 'Videojuego' : 'Evento'} eliminado correctamente.`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error al eliminar recurso:', error);
    }
  };

  if (!user || user.role !== 'ROL_ADMIN') {
    return <p style={{ padding: '40px', textAlign: 'center' }}>Cargando panel...</p>;
  }

  return (
    <div>
      <header className="page-header">
        <h1 className="gradient-text page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <LayoutDashboard size={36} style={{ color: 'var(--accent-purple)' }} />
          Panel de Administración
        </h1>
        <p className="page-subtitle">Gestiona la base de datos de videojuegos y eventos de GamerFest.</p>
      </header>

      {/* Mensajes de feedback */}
      {message && (
        <div className="glass-panel" style={{
          background: 'rgba(139, 92, 246, 0.15)',
          color: 'var(--text-primary)',
          padding: '12px 24px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          textAlign: 'center',
          border: '1px solid var(--accent-purple)'
        }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '30px' }}>
        <button
          onClick={() => setActiveTab('games')}
          className={`btn ${activeTab === 'games' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Gamepad size={18} />
          Videojuegos ({games.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Calendar size={18} />
          Eventos ({events.length})
        </button>
      </div>

      {/* Sección Videojuegos */}
      {activeTab === 'games' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="admin-header">
            <h2 style={{ fontSize: '1.4rem' }}>Listado de Videojuegos</h2>
            <button onClick={openCreateGameModal} className="btn btn-primary">
              <Plus size={16} />
              Añadir Videojuego
            </button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Lanzamiento</th>
                  <th>Plataformas</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {games.map(game => (
                  <tr key={game.id}>
                    <td style={{ fontWeight: '600' }}>{game.title}</td>
                    <td>{game.release_date || 'TBA'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {game.platforms && game.platforms.map(p => (
                          <span key={p.id} className="platform-tag">{p.name}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => openEditGameModal(game)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} title="Editar">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => openDeleteConfirm(game, 'game')} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} title="Eliminar">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sección Eventos */}
      {activeTab === 'events' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="admin-header">
            <h2 style={{ fontSize: '1.4rem' }}>Listado de Eventos</h2>
            <button onClick={openCreateEventModal} className="btn btn-primary">
              <Plus size={16} />
              Añadir Evento
            </button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Fecha y Hora</th>
                  <th>Tipo</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id}>
                    <td style={{ fontWeight: '600' }}>{event.title}</td>
                    <td>{new Date(event.event_date).toLocaleString('es-ES')}</td>
                    <td style={{ textTransform: 'capitalize' }}>{event.type}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => openEditEventModal(event)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} title="Editar">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => openDeleteConfirm(event, 'event')} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} title="Eliminar">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal CRUD Videojuego */}
      <Modal
        isOpen={isGameModalOpen}
        onClose={() => setIsGameModalOpen(false)}
        title={selectedItem ? 'Editar Videojuego' : 'Crear Videojuego'}
      >
        <form onSubmit={handleGameSubmit}>
          <div className="form-group">
            <label className="form-label">Título *</label>
            <input
              type="text"
              value={gameTitle}
              onChange={(e) => setGameTitle(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              value={gameDesc}
              onChange={(e) => setGameDesc(e.target.value)}
              className="form-control"
              rows={4}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Fecha de Lanzamiento</label>
            <input
              type="date"
              value={gameReleaseDate}
              onChange={(e) => setGameReleaseDate(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="form-label">URL de Imagen</label>
            <input
              type="text"
              value={gameImageUrl}
              onChange={(e) => setGameImageUrl(e.target.value)}
              className="form-control"
              placeholder="https://..."
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '10px' }}>Plataformas</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {platforms.map(p => {
                const selected = gameSelectedPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatformSelection(p.id)}
                    className={`btn ${selected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
            Guardar
          </button>
        </form>
      </Modal>

      {/* Modal CRUD Evento */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title={selectedItem ? 'Editar Evento' : 'Crear Evento'}
      >
        <form onSubmit={handleEventSubmit}>
          <div className="form-group">
            <label className="form-label">Título *</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
              className="form-control"
              rows={4}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Fecha y Hora *</label>
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tipo de Evento</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="form-control"
            >
              <option value="showcase">Showcase</option>
              <option value="conferencia">Conferencia</option>
              <option value="premiacion">Premiación</option>
              <option value="lanzamiento">Lanzamiento</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Enlace Oficial</label>
            <input
              type="text"
              value={eventLocationLink}
              onChange={(e) => setEventLocationLink(e.target.value)}
              className="form-control"
              placeholder="https://..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">URL de Imagen</label>
            <input
              type="text"
              value={eventImageUrl}
              onChange={(e) => setEventImageUrl(e.target.value)}
              className="form-control"
              placeholder="https://..."
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
            Guardar
          </button>
        </form>
      </Modal>

      {/* Modal Eliminar */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
      >
        <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
          ¿Estás seguro de que deseas eliminar permanentemente{' '}
          <strong style={{ color: 'var(--text-primary)' }}>
            {selectedItem ? selectedItem.title : ''}
          </strong>
          ? Esta acción no se puede deshacer.
        </p>
        <div style={{ display: 'flex', justifyContext: 'flex-end', gap: '12px' }}>
          <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
            Cancelar
          </button>
          <button onClick={handleDeleteSubmit} className="btn btn-danger" style={{ flex: 1 }}>
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('gf_token') || null);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState({ games: [], events: [] });
  const [loadingUser, setLoadingUser] = useState(true);

  // Cargar usuario al iniciar o cuando cambia el token
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setFavorites({ games: [], events: [] });
        setLoadingUser(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          // Cargar favoritos si es exitoso
          fetchFavorites(token);
        } else {
          // Token inválido o expirado
          logout();
        }
      } catch (error) {
        console.error('Error al cargar datos de usuario:', error);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('gf_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('gf_token');
    setToken(null);
    setUser(null);
    setFavorites({ games: [], events: [] });
  };

  const fetchFavorites = async (authToken = token) => {
    if (!authToken) return;
    try {
      const res = await fetch(`${API_URL}/favorites`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
    }
  };

  const toggleGameFavorite = async (gameId) => {
    if (!token) return false;
    const isFav = favorites.games.some(g => g.id === gameId);
    const method = isFav ? 'DELETE' : 'POST';
    
    try {
      const res = await fetch(`${API_URL}/favorites/games/${gameId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        await fetchFavorites();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al cambiar favorito de juego:', error);
      return false;
    }
  };

  const toggleEventFavorite = async (eventId) => {
    if (!token) return false;
    const isFav = favorites.events.some(e => e.id === eventId);
    const method = isFav ? 'DELETE' : 'POST';

    try {
      const res = await fetch(`${API_URL}/favorites/events/${eventId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        await fetchFavorites();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al cambiar favorito de evento:', error);
      return false;
    }
  };

  const isGameFavorite = (gameId) => {
    return favorites.games.some(g => g.id === gameId);
  };

  const isEventFavorite = (eventId) => {
    return favorites.events.some(e => e.id === eventId);
  };

  return (
    <AppContext.Provider value={{
      token,
      user,
      favorites,
      loadingUser,
      login,
      logout,
      fetchFavorites,
      toggleGameFavorite,
      toggleEventFavorite,
      isGameFavorite,
      isEventFavorite
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

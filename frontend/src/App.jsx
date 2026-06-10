import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas
import Home from './pages/Home';
import CalendarView from './pages/CalendarView';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

import React from 'react';
import { Info, Code, User, Star, Tag, Database, Server, Layout } from 'lucide-react';

export default function About() {
  return (
    <div className="page-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div className="section-header" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 className="gradient-accent-text" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Info size={36} />
          Acerca de GamerFest
        </h1>
        <p className="text-secondary" style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
          Toda la información sobre la plataforma, el equipo y las tecnologías detrás del proyecto.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Proyecto */}
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            <Star className="text-accent" /> Proyecto GamerFest
          </h2>
          <p className="text-secondary" style={{ lineHeight: '1.6' }}>
            GamerFest es una plataforma integral diseñada para la comunidad gamer. Nuestro objetivo es ofrecer un espacio centralizado donde los usuarios puedan descubrir nuevos lanzamientos, organizar sus calendarios de juegos, gestionar favoritos y mantenerse al día con todo lo relacionado al mundo de los videojuegos.
          </p>
        </div>

        {/* Desarrollador */}
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            <User className="text-accent" /> Desarrollador
          </h2>
          <p className="text-secondary" style={{ lineHeight: '1.6' }}>
            <strong>Lucas Peralta</strong>
          </p>
        </div>

        {/* Tecnologías */}
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            <Code className="text-accent" /> Tecnologías Usadas
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layout size={20} className="text-primary" />
              <div>
                <strong>Frontend</strong>
                <p className="text-secondary" style={{ fontSize: '0.9rem' }}>React, Vite, CSS Vanilla</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Server size={20} className="text-primary" />
              <div>
                <strong>Backend</strong>
                <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Node.js, Express</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database size={20} className="text-primary" />
              <div>
                <strong>Base de Datos</strong>
                <p className="text-secondary" style={{ fontSize: '0.9rem' }}>MySQL, Sequelize ORM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Versión */}
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            <Tag className="text-accent" /> Versión Actual
          </h2>
          <p className="text-secondary" style={{ fontSize: '1.1rem' }}>
            <strong>v1.0.1</strong> - Búsqueda en Calendario, Toggle de Contraseña y Optimizaciones Mobile
          </p>
        </div>

      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Clock } from 'lucide-react';
import './Home.css';

export function Home() {
  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Pasión por el detalle. <br />
            <span className="text-gradient">Brillo inigualable.</span>
          </h1>
          <p className="hero-subtitle">
            En Los Chalanes ofrecemos el cuidado premium que tu vehículo merece. 
            Calidad garantizada, productos profesionales y atención personalizada.
          </p>
          <div className="hero-actions">
            <Link to="/booking" className="btn-primary hero-btn">
              Agendar Turno
            </Link>
            <Link to="/services" className="btn-secondary hero-btn">
              Ver Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">¿Por qué elegirnos?</h2>
        <div className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Sparkles size={32} />
            </div>
            <h3>Acabado Premium</h3>
            <p>Utilizamos productos de alta gama para asegurar un brillo duradero y proteger la pintura de tu automóvil.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <ShieldCheck size={32} />
            </div>
            <h3>Garantía de Calidad</h3>
            <p>Atención al detalle en cada rincón. Nuestro equipo está capacitado para brindarte los mejores resultados.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Clock size={32} />
            </div>
            <h3>Puntualidad</h3>
            <p>Gestión de turnos eficiente para que no pierdas tiempo. Respetamos tu horario reservado.</p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section glass-panel">
        <h2>¿Listo para renovar el aspecto de tu auto?</h2>
        <p>Reserva tu turno hoy mismo y experimenta el servicio premium de Los Chalanes.</p>
        <Link to="/booking" className="btn-primary" style={{marginTop: '2rem'}}>
          Reservar Ahora
        </Link>
      </section>
    </div>
  );
}

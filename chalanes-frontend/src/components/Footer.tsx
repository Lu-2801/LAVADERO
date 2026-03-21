import { Link } from 'react-router-dom';
import { Car, MapPin, Phone, Instagram } from 'lucide-react';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="logo-icon-wrapper">
              <Car size={24} />
            </div>
            <span>Los Chalanes</span>
          </Link>
          <p className="footer-description">
            Cuidamos de tu vehículo como si fuera nuestro. Calidad, detalle y pasión por los autos.
          </p>
          <div className="social-links">
            <a href="https://www.instagram.com/lavadero.chalanes/" aria-label="Instagram" className="social-icon"><Instagram size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h3 className="footer-heading">Navegación</h3>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/services">Servicios</Link></li>
            <li><Link to="/booking">Turnos</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3 className="footer-heading">Contacto</h3>
          <ul className="contact-info">
            <li>
              <MapPin size={18} className="contact-icon" />
              <span>Camilo Isleño 4929</span>
            </li>
            <li>
              <Phone size={18} className="contact-icon" />
              <span>+54 351 325 2403</span>
            </li>
            <li>
              <Phone size={18} className="contact-icon" />
              <span>+54 351 294 3658</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Los Chalanes. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

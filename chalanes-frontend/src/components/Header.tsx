import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, CalendarDays, Menu, X } from 'lucide-react';
import './Header.css';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/services' },
  ];

  return (
    <header className="header glass-panel">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <div className="logo-icon-wrapper">
            <Car size={28} className="logo-icon" />
          </div>
          <span className="logo-text">Los Chalanes</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/booking" className="btn-primary">
            <CalendarDays size={18} />
            Agendar Turno
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="mobile-nav">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/booking" 
            className="btn-primary mobile-btn"
            onClick={() => setIsMenuOpen(false)}
          >
            <CalendarDays size={18} />
            Agendar Turno
          </Link>
        </nav>
      )}
    </header>
  );
}

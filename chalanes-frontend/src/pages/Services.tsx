import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, Car, Truck, Bike } from 'lucide-react';
import './Services.css';
import { API_URL } from '../config';

interface ServiceType {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion_minutos: number;
  caracteristicas: string[];
  vehiculo_id: string;
}

export function Services() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/servicios`).then(r => r.json()),
      fetch(`${API_URL}/vehiculos`).then(r => r.json())
    ]).then(([servData, vehData]) => {
      setServices(servData || []);
      setVehiculos(vehData || []);
      if (vehData && vehData.length > 0) {
        // Por defecto seleccionamos el primero (Utilitario)
        setSelectedVehicle(vehData[0].id);
      }
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching services data:', err);
      setLoading(false);
    });
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'car': return <Car size={20} />;
      case 'truck': return <Truck size={20} />;
      case 'bike': return <Bike size={20} />;
      default: return <Car size={20} />;
    }
  };

  const filteredServices = services.filter(s => s.vehiculo_id === selectedVehicle);

  if (loading) {
    return <div className="services-page animate-fade-in" style={{ textAlign: 'center', minHeight: '60vh' }}><h2 className="text-gradient">Cargando servicios...</h2></div>;
  }

  return (
    <div className="services-page animate-fade-in">
      <div className="services-header">
        <h1 className="text-gradient">Nuestros Servicios</h1>
        <p>Soluciones a medida para cada tipo de vehículo. Conoce nuestras opciones.</p>
      </div>

      <div className="services-vehicle-filter animate-fade-in">
        {vehiculos.map(v => (
          <button 
            key={v.id} 
            className={`vehicle-filter-btn ${selectedVehicle === v.id ? 'active' : ''}`}
            onClick={() => setSelectedVehicle(v.id)}
          >
            {getIconComponent(v.icono)}
            <span>{v.nombre}</span>
          </button>
        ))}
      </div>

      <div className="services-grid">
        {filteredServices.map((service) => {
          const isPopular = service.nombre.includes('Completo');
          return (
            <div key={service.id} className={`service-card glass-panel ${isPopular ? 'popular' : ''}`}>
              {isPopular && <div className="popular-badge">Más Elegido</div>}

              <h2 className="service-name">{service.nombre}</h2>
              <p className="service-desc">{service.descripcion}</p>

              <div className="service-price-wrap">
                <span className="service-price">${service.precio}</span>
              </div>

              <div className="service-duration">
                <Clock size={16} />
                <span>Tiempo estimado: {service.duracion_minutos} min</span>
              </div>

              <hr className="service-divider" />

              <ul className="service-features">
                {Array.isArray(service.caracteristicas) && service.caracteristicas.map((feature: string, idx: number) => (
                  <li key={idx}>
                    <div className="feature-check"><Check size={14} /></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to={`/booking?serviceId=${service.id}`} className={`btn-primary service-btn ${!isPopular ? 'btn-outline' : ''}`}>
                Reservar este
              </Link>
            </div>
          )
        })}
      </div>

      <div className="services-footer glass-panel">
        <h3>¿Necesitas un servicio especial?</h3>
        <p>También realizamos limpieza de tapizados profunda. Contáctanos para un presupuesto a medida.</p>
        <div className="contact-actions">
          <a href="https://wa.me/3513252403" target="_blank" rel="noreferrer" className="btn-secondary">Consultar por WhatsApp</a>
        </div>
      </div>
    </div>
  );
}

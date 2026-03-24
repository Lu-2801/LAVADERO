import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, User, Scissors, Clock, Car, Truck, Bike } from 'lucide-react';
import './Booking.css';
import { API_URL } from '../config';

export function Booking() {
  const [searchParams] = useSearchParams();
  const initialServiceId = searchParams.get('serviceId') || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehiculoId: '',
    serviceId: initialServiceId,
    date: '',
    time: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    fetch(`${API_URL}/servicios`)
      .then(res => res.json())
      .then(data => setAvailableServices(data || []))
      .catch(console.error);

    fetch(`${API_URL}/vehiculos`)
      .then(res => res.json())
      .then(data => setVehiculos(data || []))
      .catch(console.error);
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'car': return <Car size={32} />;
      case 'truck': return <Truck size={32} />;
      case 'bike': return <Bike size={32} />;
      default: return <Car size={32} />;
    }
  };

  const filteredServices = availableServices.filter(s => s.vehiculo_id === formData.vehiculoId);

  React.useEffect(() => {
    if (formData.date && formData.serviceId) {
      fetch(`${API_URL}/turnos/availability?date=${formData.date}&serviceId=${formData.serviceId}`)
        .then(res => res.json())
        .then(data => setAvailableTimes(data || []))
        .catch(console.error);
    } else {
      setAvailableTimes([]);
    }
  }, [formData.date, formData.serviceId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const resp = await fetch(`${API_URL}/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          serviceId: formData.serviceId,
          date: formData.date,
          time: formData.time
        })
      });

      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || 'Error al agendar');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    const selectedService = availableServices.find(s => s.id === formData.serviceId);
    const serviceName = selectedService ? selectedService.nombre : '';
    const textMsg = encodeURIComponent(`Hola Los Chalanes, acabo de agendar un turno para el ${formData.date} a las ${formData.time}hs a nombre de ${formData.name}. El servicio elegido es ${serviceName}. \n\n¡Gracias!`);
    const whatsappUrl = `https://wa.me/543513252403?text=${textMsg}`;

    return (
      <div className="booking-page animate-fade-in" style={{ justifyContent: 'center', minHeight: '60vh' }}>
        <div className="success-card glass-panel text-center">
          <div className="success-icon">✓</div>
          <h2>¡Turno Agendado!</h2>
          <p>Hemos registrado tu reserva para el día <strong>{formData.date}</strong> a las <strong>{formData.time}hs</strong>.</p>
          <p className="subtext">Para finalizar y confirmar, envíanos un mensaje por WhatsApp.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ background: 'var(--secondary)', color: 'white', border: 'none' }}>
              Confirmar por WhatsApp
            </a>
            <button className="btn-secondary" onClick={() => window.location.href = '/'}>
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page animate-fade-in">
      <div className="booking-header">
        <h1 className="text-gradient">Reserva tu Turno</h1>
        <p>Completa el formulario y asegura tu lugar. Es rápido y sencillo.</p>
      </div>

      <div className="booking-container">
        {errorMsg && (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: 'var(--rounded-md)', marginBottom: '2rem', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}
        <form className="booking-form glass-panel" onSubmit={handleSubmit}>

          <div className="form-section">
            <h3 className="form-section-title"><User size={18} /> Datos Personales</h3>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="name">Nombre Completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Ej: Juan Pérez"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="phone">Teléfono (WhatsApp)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  placeholder="Ej: 11 2345-6789"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>


          <div className="form-section">
            <h3 className="form-section-title"><Car size={18} /> Tipo de Vehículo</h3>
            <div className="vehicle-selector">
              {vehiculos.map(v => (
                <label key={v.id} className={`vehicle-card ${formData.vehiculoId === v.id ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="vehiculoId" 
                    value={v.id} 
                    checked={formData.vehiculoId === v.id} 
                    onChange={handleInputChange} 
                    style={{ position: 'absolute', opacity: 0 }}
                  />
                  <div className="vehicle-icon">{getIconComponent(v.icono)}</div>
                  <span className="vehicle-name">{v.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title"><Calendar size={18} /> Detalle del Turno</h3>

            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="serviceId">Servicio a Realizar</label>
              <div className="select-wrapper">
                <select
                  id="serviceId"
                  name="serviceId"
                  required
                  value={formData.serviceId}
                  onChange={handleInputChange}
                  disabled={!formData.vehiculoId}
                >
                  <option value="" disabled>
                    {!formData.vehiculoId ? 'Primero seleccione un vehículo' : 'Selecciona un servicio'}
                  </option>
                  {filteredServices.map(srv => (
                    <option key={srv.id} value={srv.id}>{srv.nombre} (${srv.precio})</option>
                  ))}
                </select>
                <Scissors className="select-icon" size={16} />
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="date">Fecha</label>
                {!formData.serviceId ? (
                  <div className="select-wrapper">
                    <input 
                      type="text" 
                      disabled 
                      value="Primero seleccione un servicio" 
                      style={{cursor: 'not-allowed' }}
                    />
                    <Calendar className="select-icon" size={16} />
                  </div>
                ) : (
                  <div className="select-wrapper">
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      min={new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })).toLocaleDateString('en-CA')}
                      value={formData.date}
                      onChange={handleInputChange}
                      style={{ paddingRight: '2.5rem' }}
                    />
                  </div>
                )}
              </div>
              <div className="input-group">
                <label htmlFor="time">Horario</label>
                <div className="select-wrapper">
                  <select
                    id="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleInputChange}
                    disabled={!formData.date}
                  >
                    <option value="" disabled>
                      {formData.date ? 'Selecciona un horario' : 'Primero elige una fecha'}
                    </option>
                    {availableTimes.map(t => (
                      <option key={t} value={t}>{t} hs</option>
                    ))}
                  </select>
                  <Clock className="select-icon" size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={isSubmitting}>
              {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
            </button>
            <p className="secure-text">Tu pago se realiza en el local al finalizar el servicio.</p>
          </div>

        </form>
      </div>
    </div>
  );
}

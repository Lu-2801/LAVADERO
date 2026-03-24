import React, { useEffect, useState } from 'react';
import './Admin.css';
import { API_URL } from '../config';
import { Login } from './Login';
import { LogOut, Edit2 } from 'lucide-react';

interface Booking {
  id: string;
  fecha: string;
  hora: string;
  cliente: string;
  telefono: string;
  estado: string;
  servicio: string;
  precio: number;
  duracion: number;
}

interface Dia {
  id: string;
  fecha: string;
  abierto: boolean;
  hora_inicio: string;
  hora_fin: string;
}

interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  duracion_minutos: number;
  vehiculo_id: string;
  activo: boolean;
  vehiculos?: { nombre: string }; // joined from backend
  descripcion: string;
  caracteristicas: string[];
}

interface Vehiculo {
  id: string;
  nombre: string;
  icono: string;
}

export function Admin() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [activeTab, setActiveTab] = useState<'turnos' | 'dias'>('turnos');
  
  // States - Turnos
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // States - Dias
  const [dias, setDias] = useState<Dia[]>([]);
  const [loadingDias, setLoadingDias] = useState(true);
  const [diaForm, setDiaForm] = useState({
    fecha: '',
    abierto: true,
    hora_inicio: '09:00',
    hora_fin: '18:00'
  });
  const [savingDia, setSavingDia] = useState(false);
  const [diaMsg, setDiaMsg] = useState({ text: '', type: '' });

  // States - Servicios
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [showServicioForm, setShowServicioForm] = useState(false);
  const [servicioForm, setServicioForm] = useState<Partial<Servicio>>({
    nombre: '',
    descripcion: '',
    caracteristicas: [],
    precio: 0,
    duracion_minutos: 30,
    vehiculo_id: '',
    activo: true
  });
  const [savingServicio, setSavingServicio] = useState(false);
  const [servicioMsg, setServicioMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (token) {
      fetchBookings();
      fetchDias();
      fetchServicios();
      fetchVehiculos();
    }
  }, [token]);

  const fetchServicios = () => {
    fetch(`${API_URL}/servicios/admin`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setServicios(data || []);
        setLoadingServicios(false);
      })
      .catch(err => {
        console.error('Error fetching servicios:', err);
        setLoadingServicios(false);
      });
  };

  const fetchVehiculos = () => {
    fetch(`${API_URL}/vehiculos`)
      .then(res => res.json())
      .then(data => setVehiculos(data || []))
      .catch(console.error);
  };

  const handleLogin = (newToken: string) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  const fetchBookings = () => {
    fetch(`${API_URL}/turnos/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          handleLogout();
          throw new Error('Sesión expirada');
        }
        return res.json();
      })
      .then(data => {
        setBookings(data || []);
        setLoadingBookings(false);
      })
      .catch(err => {
        console.error('Error fetching bookings:', err);
        setLoadingBookings(false);
      });
  };

  const fetchDias = () => {
    // GET /dias es público, pero lo consultamos igual aquí.
    fetch(`${API_URL}/dias`)
      .then(res => res.json())
      .then(data => {
        setDias(data || []);
        setLoadingDias(false);
      })
      .catch(err => {
        console.error('Error fetching dias:', err);
        setLoadingDias(false);
      });
  };

  const handleDiaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDiaForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handeSubmitDia = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDia(true);
    setDiaMsg({ text: '', type: '' });

    try {
      const resp = await fetch(`${API_URL}/dias`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          fecha: diaForm.fecha,
          abierto: diaForm.abierto,
          hora_inicio: diaForm.hora_inicio + ':00',
          hora_fin: diaForm.hora_fin + ':00'
        })
      });

      if (!resp.ok) {
        if (resp.status === 401 || resp.status === 403) {
          handleLogout();
        }
        const err = await resp.json();
        throw new Error(err.error || 'Error al guardar el día');
      }

      setDiaMsg({ text: 'Día guardado correctamente', type: 'success' });
      fetchDias(); // Refresh list
    } catch (err: any) {
      setDiaMsg({ text: err.message, type: 'error' });
    } finally {
      setSavingDia(false);
    }
  };

  const handleServicioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      finalValue = Number(value);
    }

    setServicioForm(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSubmitServicio = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingServicio(true);
    setServicioMsg({ text: '', type: '' });

    try {
      const url = servicioForm.id 
        ? `${API_URL}/servicios/${servicioForm.id}`
        : `${API_URL}/servicios`;
      const method = servicioForm.id ? 'PUT' : 'POST';

      const bodyPayload = {
        ...servicioForm,
        caracteristicas: Array.isArray(servicioForm.caracteristicas) 
          ? servicioForm.caracteristicas.map(i => i.trim()).filter(Boolean) 
          : []
      };

      const resp = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(bodyPayload)
      });

      if (!resp.ok) {
        if (resp.status === 401 || resp.status === 403) handleLogout();
        const err = await resp.json();
        throw new Error(err.error || 'Error al guardar el servicio');
      }

      setServicioMsg({ text: 'Servicio guardado correctamente', type: 'success' });
      fetchServicios();
      setTimeout(() => {
        setShowServicioForm(false);
        setServicioMsg({ text: '', type: '' });
      }, 1500);
    } catch (err: any) {
      setServicioMsg({ text: err.message, type: 'error' });
    } finally {
      setSavingServicio(false);
    }
  };

  const handleEditServicio = (srv: Servicio) => {
    setServicioForm(srv);
    setShowServicioForm(true);
    setServicioMsg({ text: '', type: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  if (loadingBookings || loadingDias) {
    return (
      <div className="admin-page animate-fade-in" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 className="text-gradient">Cargando Panel de Administración...</h2>
      </div>
    );
  }

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-header" style={{ position: 'relative' }}>
        <button 
          onClick={handleLogout}
          className="btn-outline" 
          style={{ position: 'absolute', right: 0, top: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
        >
          <LogOut size={16} /> Salir
        </button>
        <h1 className="text-gradient">Panel de Administración</h1>
        <p>Gestiona los turnos y los días de servicio de Los Chalanes.</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'turnos' ? 'active' : ''}`}
          onClick={() => setActiveTab('turnos')}
        >
          Turnos Agendados
        </button>
        <button 
          className={`tab-btn ${activeTab === 'dias' ? 'active' : ''}`}
          onClick={() => setActiveTab('dias')}
        >
          Días y Horarios
        </button>
        <button 
          className={`tab-btn ${activeTab === 'servicios' as any ? 'active' : ''}`}
          onClick={() => setActiveTab('servicios' as any)}
        >
          Servicios
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'turnos' && (
          <section className="admin-section glass-panel animate-fade-in">
            <h2>Turnos Agendados</h2>
            
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Cliente</th>
                    <th>WhatsApp</th>
                    <th>Servicio</th>
                    <th>Precio</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center" style={{ padding: '2rem' }}>
                        No hay turnos agendados aún.
                      </td>
                    </tr>
                  ) : (
                    bookings.map(b => (
                      <tr key={b.id}>
                        <td><strong>{b.fecha}</strong></td>
                        <td>{b.hora.substring(0,5)} hs</td>
                        <td>{b.cliente}</td>
                        <td>
                          <a href={`https://wa.me/${b.telefono.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-gradient">
                            {b.telefono}
                          </a>
                        </td>
                        <td>{b.servicio} ({b.duracion} min)</td>
                        <td>${b.precio}</td>
                        <td>
                          <span className={`status-badge status-${b.estado?.toLowerCase() || 'pendiente'}`}>
                            {b.estado || 'Pendiente'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'dias' && (
          <section className="admin-section glass-panel animate-fade-in">
            <h2>Gestión de Días y Horarios</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              Configura horarios especiales o marca días como cerrados.
            </p>

            <form className="dia-form" onSubmit={handeSubmitDia}>
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="fecha">Fecha</label>
                  <input type="date" id="fecha" name="fecha" required min={new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })).toLocaleDateString('en-CA')} value={diaForm.fecha} onChange={handleDiaChange} />
                </div>
                <div className="input-group check-group">
                  <label>
                    <input type="checkbox" name="abierto" checked={diaForm.abierto} onChange={handleDiaChange} />
                    Día Abierto
                  </label>
                </div>
                <div className="input-group">
                  <label htmlFor="hora_inicio">Hora Apertura</label>
                  <input type="time" id="hora_inicio" name="hora_inicio" disabled={!diaForm.abierto} required={diaForm.abierto} value={diaForm.hora_inicio} onChange={handleDiaChange} />
                </div>
                <div className="input-group">
                  <label htmlFor="hora_fin">Hora Cierre</label>
                  <input type="time" id="hora_fin" name="hora_fin" disabled={!diaForm.abierto} required={diaForm.abierto} value={diaForm.hora_fin} onChange={handleDiaChange} />
                </div>
              </div>
              
              {diaMsg.text && (
                <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '8px', background: diaMsg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: diaMsg.type === 'error' ? '#fca5a5' : '#6ee7b7' }}>
                  {diaMsg.text}
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }} disabled={savingDia}>
                {savingDia ? 'Guardando...' : 'Guardar Configuración del Día'}
              </button>
            </form>

            <h3 style={{ marginTop: '3rem', marginBottom: '1rem' }}>Días Configurados</h3>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Apertura</th>
                    <th>Cierre</th>
                  </tr>
                </thead>
                <tbody>
                  {dias.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center" style={{ padding: '2rem' }}>
                        No hay días configurados.
                      </td>
                    </tr>
                  ) : (
                    dias.map(d => (
                      <tr key={d.id}>
                        <td><strong>{d.fecha}</strong></td>
                        <td>
                          <span className={`status-badge status-${d.abierto ? 'confirmado' : 'cancelado'}`}>
                            {d.abierto ? 'Abierto' : 'Cerrado'}
                          </span>
                        </td>
                        <td>{d.abierto ? d.hora_inicio.substring(0,5) : '-'}</td>
                        <td>{d.abierto ? d.hora_fin.substring(0,5) : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'servicios' as any && (
          <section className="admin-section glass-panel animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2>Gestión de Servicios</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Añade, edita o deshabilita servicios.</p>
              </div>
              <button 
                className="btn-primary" 
                onClick={() => {
                  setServicioForm({ nombre: '', descripcion: '', caracteristicas: [], precio: 0, duracion_minutos: 30, vehiculo_id: vehiculos[0]?.id || '', activo: true });
                  setShowServicioForm(true);
                  setServicioMsg({ text: '', type: '' });
                }}
              >
                + Añadir Servicio
              </button>
            </div>

            {showServicioForm && (
              <form className="dia-form" onSubmit={handleSubmitServicio} style={{ marginBottom: '3rem', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '1rem' }}>{servicioForm.id ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
                
                <div className="form-grid">
                  <div className="input-group">
                    <label>Nombre del Servicio</label>
                    <input type="text" name="nombre" required value={servicioForm.nombre || ''} onChange={handleServicioChange} />
                  </div>
                  <div className="input-group">
                    <label>Precio ($)</label>
                    <input type="number" name="precio" required min="0" value={servicioForm.precio || 0} onChange={handleServicioChange} />
                  </div>
                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Descripción</label>
                    <textarea name="descripcion" rows={2} required value={servicioForm.descripcion || ''} onChange={handleServicioChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontFamily: 'inherit', resize: 'vertical' }} />
                  </div>
                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Ítems del Servicio (uno por línea)</label>
                    <textarea name="caracteristicas" rows={4} placeholder="Ej:&#10;Lavado exterior&#10;Aspirado interior" required value={Array.isArray(servicioForm.caracteristicas) ? servicioForm.caracteristicas.join('\n') : ''} onChange={(e) => {
                      setServicioForm(prev => ({ ...prev, caracteristicas: e.target.value.split('\n') }));
                    }} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontFamily: 'inherit', resize: 'vertical' }} />
                  </div>
                  <div className="input-group">
                    <label>Duración (Minutos)</label>
                    <input type="number" name="duracion_minutos" required min="1" value={servicioForm.duracion_minutos || 30} onChange={handleServicioChange} />
                  </div>
                  <div className="input-group">
                    <label>Tipo de Vehículo</label>
                    <select name="vehiculo_id" required value={servicioForm.vehiculo_id || ''} onChange={handleServicioChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }}>
                      <option value="" disabled>Seleccione un vehículo</option>
                      {vehiculos.map(v => (
                        <option key={v.id} value={v.id}>{v.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group check-group">
                    <label>
                      <input type="checkbox" name="activo" checked={!!servicioForm.activo} onChange={handleServicioChange} /> 
                      Servicio Activo
                    </label>
                  </div>
                </div>

                {servicioMsg.text && (
                  <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '8px', background: servicioMsg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: servicioMsg.type === 'error' ? '#fca5a5' : '#6ee7b7' }}>
                    {servicioMsg.text}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn-primary" disabled={savingServicio}>
                    {savingServicio ? 'Guardando...' : 'Guardar Servicio'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setShowServicioForm(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Vehículo</th>
                    <th>Precio</th>
                    <th>Duración</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingServicios ? (
                    <tr>
                      <td colSpan={6} className="text-center" style={{ padding: '2rem' }}>Cargando...</td>
                    </tr>
                  ) : servicios.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center" style={{ padding: '2rem' }}>No hay servicios configurados.</td>
                    </tr>
                  ) : (
                    servicios.map(s => (
                      <tr key={s.id}>
                        <td><strong>{s.nombre}</strong></td>
                        <td>{s.vehiculos?.nombre || s.vehiculo_id}</td>
                        <td>${s.precio}</td>
                        <td>{s.duracion_minutos} min</td>
                        <td>
                          <span className={`status-badge status-${s.activo ? 'confirmado' : 'cancelado'}`}>
                            {s.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <button className="btn-outline" style={{ padding: '0.4rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleEditServicio(s)} title="Editar Servicio">
                            <Edit2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

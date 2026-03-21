import React, { useState } from 'react';
import { API_URL } from '../config';

export function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
      
      onLogin(data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page animate-fade-in" style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 className="text-gradient">Acceso Empleados</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', marginTop: '0.5rem' }}>Ingrese el PIN del local para continuar</p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="password" 
            placeholder="PIN de acceso" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              marginBottom: '1rem', 
              borderRadius: '8px', 
              border: '1px solid var(--surface-border)', 
              background: 'rgba(0,0,0,0.2)', 
              color: 'white',
              textAlign: 'center',
              letterSpacing: '0.5rem',
              fontSize: '1.25rem'
            }}
            required
            autoFocus
          />
          {error && <p style={{ color: '#fca5a5', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

import { supabase } from "./db.service.js";

// MAX_CUPOS is handled by the SQL logic dynamically by checking overlaps.

export const createBookingService = async (payload) => {
  const { data, error } = await supabase.rpc(
    "crear_turno",
    {
      p_fecha: payload.date,
      p_hora: payload.time,
      p_cliente: payload.name,
      p_telefono: payload.phone,
      p_servicio_id: payload.serviceId
    }
  );

  if (error) throw error;

  return data;
};

export const getAvailabilityService = async (date, serviceId) => {
  const { data: duracion, error: errC } = await supabase.rpc(
    "calcular_duracion_servicios",
    { p_servicio_id: serviceId }
  );

  if (errC) throw errC;

  const { data, error } = await supabase.rpc(
    "horarios_disponibles",
    {
      p_fecha: date,
      p_duracion: duracion
    }
  );

  if (error) throw error;

  return data;
};

export const getAllBookingsService = async () => {
  const { data, error } = await supabase
    .from('turnos')
    .select(`
      id,
      hora,
      cliente_nombre,
      cliente_telefono,
      estado,
      dias ( fecha ),
      servicios ( nombre, precio, duracion_minutos )
    `)
    .order('dias(fecha)', { ascending: false }, { nullsFirst: false });

  if (error) throw new Error(error.message);
  
  return data.map(turno => ({
    id: turno.id,
    fecha: turno.dias?.fecha,
    hora: turno.hora,
    cliente: turno.cliente_nombre,
    telefono: turno.cliente_telefono,
    estado: turno.estado,
    servicio: turno.servicios?.nombre,
    precio: turno.servicios?.precio,
    duracion: turno.servicios?.duracion_minutos
  }));
};

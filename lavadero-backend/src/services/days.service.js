// src/services/days.service.js
import { supabase } from "./db.service.js";

export const obtenerDias = async ({ desde, hasta }) => {
  let query = supabase.from("dias").select("*");

  if (desde) query = query.gte("fecha", desde);
  if (hasta) query = query.lte("fecha", hasta);

  const { data, error } = await query.order("fecha", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

export const guardarDia = async ({ fecha, abierto, hora_inicio, hora_fin }) => {
  // Aseguramos que usemos strings de hora validas
  const payload = { 
    fecha, 
    abierto, 
    hora_inicio: hora_inicio || '09:00:00', 
    hora_fin: hora_fin || '18:00:00' 
  };

  const { data, error } = await supabase
    .from("dias")
    .upsert(payload, { onConflict: "fecha" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

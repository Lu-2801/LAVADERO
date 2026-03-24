import { supabase } from "./db.service.js";

export const getServicesService = async () => {
  let query = supabase.from("servicios").select("*").eq("activo", true);
  const { data, error } = await query.order("nombre", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

export const getAdminServicesService = async () => {
  const { data, error } = await supabase
    .from("servicios")
    .select(`*, vehiculos (nombre)`)
    .order("nombre", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

export const createServiceService = async (payload) => {
  const { data, error } = await supabase
    .from("servicios")
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateServiceService = async (id, payload) => {
  const { data, error } = await supabase
    .from("servicios")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};
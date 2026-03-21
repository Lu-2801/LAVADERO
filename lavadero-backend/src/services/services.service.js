import { supabase } from "./db.service.js";

export const getServicesService = async () => {
  let query = supabase.from("servicios").select("*").eq("activo", true);

  const { data, error } = await query.order("nombre", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};
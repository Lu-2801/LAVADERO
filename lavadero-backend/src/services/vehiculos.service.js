import { supabase } from "./db.service.js";

export const getVehiculosService = async () => {
  const { data, error } = await supabase
    .from("vehiculos")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

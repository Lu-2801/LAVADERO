import { getVehiculosService } from "../services/vehiculos.service.js";

export const getVehiculos = async (req, res) => {
  try {
    const vehiculos = await getVehiculosService();
    return res.json(vehiculos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

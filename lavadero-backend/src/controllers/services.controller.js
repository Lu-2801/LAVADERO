import { getServicesService } from "../services/services.service.js";

export const getServices = async (req, res) => {
  try {
    const services = await getServicesService();
    return res.json(services);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
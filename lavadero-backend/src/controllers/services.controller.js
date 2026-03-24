import { 
  getServicesService, 
  getAdminServicesService, 
  createServiceService, 
  updateServiceService 
} from "../services/services.service.js";

export const getServices = async (req, res) => {
  try {
    const services = await getServicesService();
    return res.json(services);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getAdminServices = async (req, res) => {
  try {
    const services = await getAdminServicesService();
    return res.json(services);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { nombre, precio, duracion_minutos, vehiculo_id, activo, descripcion, caracteristicas } = req.body;
    if (!nombre || !precio || !duracion_minutos || !vehiculo_id) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }
    const payload = {
      nombre, 
      precio, 
      duracion_minutos, 
      vehiculo_id, 
      activo: activo ?? true,
      descripcion: descripcion || '',
      caracteristicas: caracteristicas || []
    };
    const newService = await createServiceService(payload);
    return res.status(201).json(newService);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, duracion_minutos, vehiculo_id, activo, descripcion, caracteristicas } = req.body;
    
    // Solo actualizamos los campos enviados
    const payload = {};
    if (nombre !== undefined) payload.nombre = nombre;
    if (precio !== undefined) payload.precio = precio;
    if (duracion_minutos !== undefined) payload.duracion_minutos = duracion_minutos;
    if (vehiculo_id !== undefined) payload.vehiculo_id = vehiculo_id;
    if (activo !== undefined) payload.activo = activo;
    if (descripcion !== undefined) payload.descripcion = descripcion;
    if (caracteristicas !== undefined) payload.caracteristicas = caracteristicas;

    const updatedService = await updateServiceService(id, payload);
    return res.json(updatedService);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
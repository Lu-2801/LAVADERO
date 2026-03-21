// src/controllers/days.controller.js
import { obtenerDias, guardarDia } from "../services/days.service.js";

export const getDays = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    const dias = await obtenerDias({ desde, hasta });
    return res.json(dias);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const setDay = async (req, res) => {
  try {
    const { fecha, abierto, hora_inicio, hora_fin } = req.body;

    if (!fecha || typeof abierto !== "boolean") {
      return res.status(400).json({ error: "Faltan datos: fecha y abierto (boolean)" });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return res.status(400).json({ error: "Formato de fecha inválido. Use YYYY-MM-DD" });
    }

    const nuevoDia = await guardarDia({ fecha, abierto, hora_inicio, hora_fin });
    return res.status(201).json(nuevoDia);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

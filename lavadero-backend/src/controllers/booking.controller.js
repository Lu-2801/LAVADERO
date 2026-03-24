import { createBookingService, getAvailabilityService, getAllBookingsService } from "../services/booking.service.js";

const getArgentinaDate = () => {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
};

export const createBooking = async (req, res) => {
  try {
    const { date, time } = req.body;
    if (date && time) {
      const nowAR = getArgentinaDate();
      const todayStr = nowAR.toLocaleDateString('en-CA'); // YYYY-MM-DD
      const currentTimeStr = nowAR.toTimeString().split(' ')[0]; // HH:MM:SS
      
      if (date < todayStr) {
        return res.status(400).json({ error: "No se pueden agendar turnos para días pasados." });
      }
      if (date === todayStr && time < currentTimeStr) {
        return res.status(400).json({ error: "No se pueden agendar turnos para horarios pasados." });
      }
    }

    const turno = await createBookingService(req.body);
    return res.status(201).json(turno);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export const getAvailability = async (req, res) => {
  try {
    const { date, serviceId } = req.query;
    
    if (!date || !serviceId) {
      return res.status(400).json({ error: 'Faltan parámetros: date y serviceId' });
    }

    const nowAR = getArgentinaDate();
    const todayStr = nowAR.toLocaleDateString('en-CA');

    if (date < todayStr) {
      return res.status(200).json([]);
    }

    let availability = await getAvailabilityService(date, serviceId);

    if (date === todayStr) {
      const currentTimeStr = nowAR.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
      availability = availability.filter(t => {
        const timeFormatted = t.length === 5 ? t : `0${t}`;
        return timeFormatted > currentTimeStr; 
      });
    }

    return res.status(200).json(availability);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await getAllBookingsService();
    return res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

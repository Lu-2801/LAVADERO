import { createBookingService, getAvailabilityService, getAllBookingsService } from "../services/booking.service.js";

export const createBooking = async (req, res) => {
  try {
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

    const availability = await getAvailabilityService(date, serviceId);
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

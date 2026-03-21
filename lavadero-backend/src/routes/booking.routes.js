import { Router } from "express";
import { createBooking, getAvailability, getAllBookings } from "../controllers/booking.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /bookings?fecha=YYYY-MM-DD
// router.get("/", getBookings);

// POST /bookings
router.post("/", createBooking);
router.get("/availability", getAvailability);

// GET /bookings/all (Admin)
router.get("/all", requireAdmin, getAllBookings);

export default router;

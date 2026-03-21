import { Router } from "express";
import {getServices } from "../controllers/services.controller.js";

const router = Router();

// GET /bookings?fecha=YYYY-MM-DD
// router.get("/", getBookings);

// POST /bookings
router.get("/", getServices);

export default router;
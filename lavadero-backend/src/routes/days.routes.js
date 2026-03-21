import { Router } from "express";
import { getDays, setDay } from "../controllers/days.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getDays);    // GET /dias -> lista días (opcional: rango)
router.post("/", requireAdmin, setDay);    // POST /dias -> crear/actualizar un día (upsert)

export default router;

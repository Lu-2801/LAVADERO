import { Router } from "express";
import {
  getServices,
  getAdminServices,
  createService,
  updateService
} from "../controllers/services.controller.js";

const router = Router();

router.get("/", getServices);
router.get("/admin", getAdminServices);
router.post("/", createService);
router.put("/:id", updateService);

export default router;
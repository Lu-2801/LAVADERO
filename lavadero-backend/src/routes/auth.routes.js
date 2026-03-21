import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", (req, res) => {
  const { pin } = req.body;
  const adminPin = process.env.ADMIN_PIN || "1234"; // Default 1234 if not set

  if (pin === adminPin) {
    const token = jwt.sign(
      { role: "admin" }, 
      process.env.JWT_SECRET || "secreto_desarrollo", 
      { expiresIn: "7d" }
    );
    res.json({ token });
  } else {
    res.status(401).json({ error: "PIN incorrecto" });
  }
});

export default router;

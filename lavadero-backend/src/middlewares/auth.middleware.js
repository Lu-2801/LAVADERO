import jwt from "jsonwebtoken";

export const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "Acceso denegado. Token no proveído." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto_desarrollo");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};

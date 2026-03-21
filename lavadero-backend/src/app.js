import express from "express";
import cors from "cors";

import daysRoutes from "./routes/days.routes.js";
import bookingsRoutes from "./routes/booking.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import vehiculosRoutes from "./routes/vehiculos.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/dias", daysRoutes);
app.use("/turnos", bookingsRoutes);
app.use("/servicios", servicesRoutes);
app.use("/vehiculos", vehiculosRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => res.send("Backend del lavadero funcionando"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor iniciado en http://localhost:${PORT}`));

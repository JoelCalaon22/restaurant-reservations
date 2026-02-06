import express from "express";
import cors from "cors";
import brnachesRoutes from "./routes/branches.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.get("/", (_req, res) => {
  res.send(
    "Restaurant Reservations API. Try: GET /health, GET /branches"
  );
});
 
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "restaurant-reservations" });
});

app.use("/branches", brnachesRoutes)

app.use("/auth", authRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

});

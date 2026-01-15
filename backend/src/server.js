import express from "express";
import cors from "cors";
import brnachesRoutes from "./routes/branches.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "restaurant-reservations" });
});

app.use("/branches", brnachesRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

});

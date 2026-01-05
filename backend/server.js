import express from "express"; 
import { branches } from "./data/branches.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok", sevice: "restaurant-reservations"});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server running on http://localhost:$(PORT)');
});

app.get("/branches", (_req, res) => {
  res.json(branches);
});

app.get("/branches/:id", (req, res) => {
  const branch = branches.find(b => b.id === req.params.id);

  if (!branch) {
    return res.status(404).json({ message: "Branch not found" });
  }

  res.json(branch);
});

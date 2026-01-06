import express from "express";
import { branches } from "./data/branches.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "restaurant-reservations" });
});


app.get("/branches", (req, res) => {
  const { city } = req.query;

  let result = branches;

  if (city){
    const cityLower = city.toLowerCase();
    result = branches.filter(b => b.city.toLowerCase() === cityLower);

  } 
  
  res.json(result);
});

app.get("/branches/:id", (req, res) => {
  const branch = branches.find(b => b.id === req.params.id);

  if (!branch) {
    return res.status(404).json({ message: "Branch not found" });
  }

  res.json(branch);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

});

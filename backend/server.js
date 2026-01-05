import express from "express"; 

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok", sevice: "restaurant-reservations"});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server running on http://localhost:$(PORT)');
});
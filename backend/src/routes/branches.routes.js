import { Router } from "express";
import { branches } from "../data/branches.js";

const router = Router();

router.get("/", (req, res) => {
    const { city } = req.query;

    let result = branches;

    if (city) {
        const citylower = city.toLowerCase();
        result = branches.filter(
            b => b.city.toLowerCase() === citylower
        );
    }

    res.json(result);
});

router.get("/:id", (req, res) => {
    const branch = branches.find(b => b.id === req.params.id);
    
    if(!branch){
        return res.status(404).json({ message: "branch not found"});
    }

    res.json(branch);
});

export default router;
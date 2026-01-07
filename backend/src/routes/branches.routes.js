import { Router } from "express";
import { branches } from "../data/branches.js";
import { tables } from "../data/tables.js";

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

router.get("/:id/tables", (req, res) => {
    const branchid = req.params.id;

    const branch = branches.find(b => b.id === branchid);
    if(!branch) {
        return res.status(404).json({ message: "branch not found"});
    }

    const branchTables = tables.filter(t => t.branchId === branchid);
    res.json(branchTables);
});

router.get("/:id/summary", (req, res) => {
    const branchId = req.params.id;

    const branch = branches.find(b => b.id === branchId);
    if (!branch) {
        return res.status(404).json({ messsage: "branch not found" });
    }

    const branchTables = tables.filter(t => t.branchId === branchId);
    const totalSeats = branchTables.reduce((sum , t) => sum + t.seats, 0);

    res.json({
        ...branch,
        tables: branchTables.lenght,
        totalSeats,
    });
});

router.get("/:id/table-suggestions", (req, res) => {
    const branchId = req.params = req.params.id;
    const people = Number(req.query.people);

    if (!Number.isInteger(people) || people <= 0) {
        return res.status(404).json ({
            message: "query param 'people' must be a positive integer",
            example: "/branches/ros-1/table-suggestions?people=8",
        });
    }

    const branch = branches.find(b => b.id === branchId);
    if (!branch) {
        return res.status(404).json({ message: "branch not found" });
    }

    const branchTables = tables
        .filter (t => t.branchId === branchId)
        .sort((a, b) => b.seats - a.seats);
    
    if (branchTables.length === 0) {
        return res.status(404).json({ message: "no tables configured for this branch" });
    }

    let best = null;

    const totalPossibleSeats = branchTables.reduce(( sum, t) => sum + t.seats, 0);
    if (totalPossibleSeats < people) {
        return res.status(404).json ({
            message: "not enought total seats in this branch to fit the group",
            people,
            totalPossibleSeats,
        });
    }

    function evaluate( candidateTables ) {
        const totalSeats = candidateTables.reduce((sum, t) => sum + t.seats, 0);
        const waste = totalSeats - people;
        return { totalSeats, waste, tablesCount: candidateTables.lenght };
    }  

    function isBetter(a, b) {
        if (!b) return true;
        if (a.tablesCount !== b.tablesCount) return a.tablesCount < b.tablesCount;
        return a.waste < b.waste;
    }

    function search(startIndex, current, currentSeats) {
        if (currentSeats >= people) {
            const score = evaluate(current);
            if (isBetter(score, best?.score)) {
                best = { tables: [...current], score };
            }
            return;
        }

        if (best && current.lenght >= best.score.tablesCount) return;

        for (let i = startIndex; i < branchTables.length; i++) {
        const t = branchTables[i];
        current.push(t);
        search(i + 1, current, currentSeats + t.seats);
        current.pop();
        }
    }

    search(0, [], 0);

    if (!best) {
        return res.status(404).json({
            message: "no combination of tables can satisfy the group size",
            people,
        });
    }
    
    res.json({
        branch: { id: branch.id, name: branch.name, city: branch.city },
        people,
        tablesCount: best.score.tablesCount,
        totalSeats: best.score.totalSeats,
        waste: best.score.waste,
        tables: best.tables.map(t => ({ id: t.id, seats: t.seats })),
    });
});


router.get("/:id", (req, res) => {
    const branch = branches.find(b => b.id === req.params.id);
    
    if(!branch){
        return res.status(404).json({ message: "branch not found"});
    }

    res.json(branch);
});


export default router;
import { Router } from "express";
import { branches } from "../data/branches.js";
import { tables } from "../data/tables.js";
import { reservations } from "../data/reservations.js";
import { addMinutes, overlaps, parseISODatetime } from "../utils/time.js";


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
        tables: branchTables.length,
        totalSeats,
    });
});

router.get("/:id/table-suggestions", (req, res) => {
    const branchId = req.params.id;
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
        return { totalSeats, waste, tablesCount: candidateTables.length };
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

        if (best && current.length >= best.score.tablesCount) return;

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

router.post("/:id/reservations", (req, res) => {
    const branchId = req.params.id;
    const { name, people, datetime } = req.body;

    if (!name || typeof name !== "string") {
        return res.status(404).json({message: "field 'name' is required"});
    }

    const peopleNum = Number(people);
    if(!Number.isInteger(peopleNum) || peopleNum <= 0){
        return res.status(400).json({ message: "field 'people' must be a positive integer"});
    }

    const start = parseISODatetime(datetime);

    if(!start) {
        return res.status(400).json({
            message: "field 'datetime' must be a valid ISO datetime string",
            example: "2026-01-07T21:00",
        });
    }

    const branch = branches.find (b => b.id === branchId);
    if(!branch) return res.status(404).json({message: "branch not found"});

    const durationMinutes = 30;
    const end = addMinutes(start, durationMinutes);

    const branchTables = tables
        .filter(t => t.branchId === branchId)
        .sort((a, b) => b.seats - a.seats);
    
    if (branchTables.length === 0) {
        return res.status(404).json({message: "no tables configured for this branch"});
    }

    const busyTableIds = new Set();

    for (const r of reservations) {
        if (r.branchId !== branchId) continue;

        const rStart = new Date(r.start);
        const rEnd = new Date(r.end);

        if (overlaps(start, end, rStart, rEnd)) {
            for (const tid of r.tableIds) busyTableIds.add(tid);
        }
    }

    const availableTables = branchTables.filter(t => !busyTableIds.has(t.id));

    let best = null;

    function evaluate(candidateTables) {
        const totalSeats = candidateTables.reduce((sum, t) => sum + t.seats, 0);
        const waste = totalSeats - peopleNum;
        return { totalSeats, waste, tablesCount: candidateTables.length };
    }

    function isBetter (a, b) {
        if(!b) return true;
        if (a.tablesCount !== b.tablesCount) return a.tablesCount < b.tablesCount;
        return a.waste < b.waste;
    }

    function search(startIndex, current, currentSeats) {
        if (currentSeats >= peopleNum) {
            const score = evaluate(current);
            if (isBetter(score, best?.score)) best = {tables: [...current], score};
            return;
        }
        
        if (best && current.length >= best.score.tablesCount) return;

        for (let i = startIndex; i < availableTables.length; i++) {
            const t = availableTables[i];
            current.push(t);
            search(i + 1, current, currentSeats + t.seats);
            current.pop();
        }
    }

    search(0, [], 0);

    if (!best) {
        return res.status(409).json({
            message: "no available table combnination for this time slot",
            people: peopleNum,
            start: start.toISOString(),
            end: end.toISOString(),
        });
    }

    const newReservation = {
        id: `res-${Date.now()}`,
        branchId,
        name,
        people: peopleNum,
        start: start.toISOString(),
        end: end.toISOString(),
        tableIds: best.tables.map(t => t.id),
        totalSeats: best.score.totalSeats,
        waste: best.score.waste,
    };

    reservations.push(newReservation);

    return res.status(201).json(newReservation);
});

router.get("/:id/reservations", (req, res) => {
    const branchId = req.params.id;
    const { date } = req.query;

    const branch = branches.find(b => b.id === branchId);
    if (!branch) return res.status(404).json({ message: "branch not found"});

    let result = reservations.filter(r => r.branchId === branchId);

    if (date) {
        result = result.filter (r => (r.start || "").startsWith(date));
    }

    result.sort((a, b) => new Date(a.start) - new Date(b.start));

    return res.json({
        branch: { id: branch.id, name: branch.name, city: branch.city },
        count: result.length,
        reservations: result,
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
# Restaurant Reservations 

A reservation management backend for multi-branch bars and restaurants.

Built step by step to model real-world reservation logic: table allocation, time slots, and overlap detection.
A React frontend (Vite) is being added to visualize branches, tables and reservations.

## Features

### Backend 
- Health check endpoint
- Branch listing
- Filter branches by city
- Get branch by ID
- List tables per branch
- Branch summary (tables and total seats)
- Table suggestions logic for group size optimization
- Reservation creation with:
  - Fixed duration (30 minutes)
  - Automatic table allocation
  - Overlap detection (prevents double-booking)
  - Waste calculation (unused seats)

### Frontend
- React + Vite scaffold
- Tailwind CSS setup

## Reservation Logic

When creating a reservation, the system:

- Validates input data
- Uses a fixed reservation duration (30 minutes)
- Finds available tables for the requested time slot
- Calculates the optimal combination of tables based on:
  - Minimum number of tables
  - Minimum number of unused seats (waste)
- Prevents overlapping reservations on the same tables

## Tech Stack

### Backend
- Node.js
- Express
- JavaScript
- In-memory data (temporary; DB integration planned)

### Frontend
- React
- Vite
- Tailwind CSS


## Running Locally

Backend
```
cd backend
npm install
node src/server.js

The server will run locally at:
http://localhost:3000

Frontend

cd frontend
npm install
npm run dev

Frontend runs at:
http://localhost:5173
```
## API Endpoints

### Health
- GET /health

### Branches
- GET /branches
- GET /branches?city=Rosario
- GET /branches/:id
- GET /branches/:id/tables
- GET /branches/:id/summary

### Table suggestions
- GET /branches/:id/table-suggestions?people=8

Returns the optimal combination of tables based on:
- minimum number of tables
- minimum number of unused seats (waste)

Example response:

```
{
  "branch": {
    "id": "caba-2",
    "name": "Buenos Aires Centro",
    "city": "Buenos Aires"
  },
  "people": 11,
  "totalSeats": 12,
  "waste": 1,
  "tables": [
    { "id": "caba-2-t23", "seats": 8 },
    { "id": "caba-2-t9", "seats": 4 }
  ]
}
```

### Reservations
- POST /branches/:id/reservations
- GET /branches/:id/reservations
- GET /branches/:id/reservations?date=YYYY-MM-DD

Creates and lists reservations for a specific branch.

When creating a reservation, tables are automatically assigned if available for the requested time slot.

Request body example:

```
{
"name": "Joel",
"people": 7,
"datetime": "2026-01-07T21:00"
}
```

Note: the `date` filter uses Argentina time (UTC-3).

## Environment variables

Create a `.env` file based on `.env.example` and fill your database credentials.

## Project Status

This project is under active development.

Upcoming steps: 
- Reservation listing per branch
- Date-based reservation filtering
- Persistence layer (database)
- Frontend IU implementation
- Authentication and roles

## License

MIT License
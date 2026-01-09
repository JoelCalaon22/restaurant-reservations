# Restaurant Reservations 

Restaurant Reservations is a backend system for managing table reservations in multi-branch bars and restaurants.

The project is built step by step to model a real-world scenario, focusing on reservation logic, table allocation and time-based availability.

It is designed as a core system that can later be extended with a database and a frontend application.

## Features

- Health check endpoint
- Branch listing
- Filter branches by city
- Get branch by ID
- List tables per branch
- Branch summary (tables and total seats)
- Table suggestion logic for group size optimization
- Automatic table allocation
- Overlap detection for reservations
- Waste calculation (unused seats)

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

- Node.js
- Express
- JavaScript
- In-memory data (temporary)

## Running Locally

1. Install dependencies
   npm install

2. Start server
   node backend/src/server.js
The server will run locally at:
http://localhost:3000

## Available Endpoints

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

Note: the `date` filter matches the reservation `start` ISO string (UTC).

## Project Status

This project is under active development.

Upcoming steps: 
- Reservation listing per branch
- Date-based reservation filtering
- Persistence layer (database)
- Frontend integration
- Authentication and roles

## License

MIT License
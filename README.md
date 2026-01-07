Restaurant Reservations 

This project is a restaurant reservation management system built step by step.

The goal is to model a real-world scenario for multi-branch bars and restaurants, including branches, tables and reservation logic.

## Features

- Health check endpoint
- Branch listing
- Filter branches by city
- Get branch by ID
- List tables per branch
- Branch summary (tables and total seats)
- Table suggestion logic for group size optimization

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
The API will be available locally at:
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

## Project Status

This project is under active development.

Upcoming steps: 
- Reservation creation with time slots (30 minutes)
- Table availability and blocking 
- Persistence layer (database)
- Frontend integration

## License

MIT License
Restaurant Reservations 

This project is a restaurant reservation management system built step by step.

The goal is to model a real-world scenario for multi-branch bars and restaurants, including branches, tables and reservation logic.

Current freatures:
-Health check endpoint
- Branch listing
- Filter branches by city
- Get branch by id
- List tables per branch

Tech stack:
- Node.js
- Express
- In-memory data (temporary)

Running locally:
1. Install dependencies
   npm install

2. Start server
   node backend/src/server.js

Available endpoints:
- GET /health
- GET /branches
- GET /branches?city=Rosario
- GET /branches/:id
- GET /branches/:id/tables

Project status:
This project is under active development.
Upcoming steps include reservation availability logic and persistence layer.
# Cloud 9 Café

Restructured repository with separate **frontend** and **backend** folders.

## Folder Directory Structure

```text
Cloud 9 Café/
├── frontend/                  <-- React + Vite Client
│   ├── public/                <-- Static assets
│   ├── src/                   <-- React components & pages
│   ├── index.html             <-- HTML entry template
│   ├── vite.config.js         <-- Vite dev configuration
│   └── package.json           <-- Frontend scripts & dependencies
├── backend/                   <-- Express Server (Backend API)
│   ├── data/                  <-- JSON Database files
│   ├── middleware/            <-- Request validators
│   ├── db.js                  <-- In-memory data store helper
│   ├── index.js               <-- Server main file
│   └── package.json           <-- Backend scripts & dependencies
└── package.json               <-- Root helper script workspace
```

---

## How to Get Started

### 1. Install Dependencies
You can install dependencies for both the frontend and backend with a single command from the root directory:
```bash
npm run install:all
```

Alternatively, you can install them manually inside their respective directories:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

---

### 2. Run in Development Mode

To run both servers in development mode:

#### From the root folder (using helper scripts):
- **Start Backend:** `npm run dev:backend` (runs on `http://localhost:5000`)
- **Start Frontend:** `npm run dev:frontend` (runs on `http://localhost:5173`)

#### Or run manually from each folder:
- **Frontend:**
  ```bash
  cd frontend
  npm run dev
  ```
- **Backend:**
  ```bash
  cd backend
  npm run dev
  ```

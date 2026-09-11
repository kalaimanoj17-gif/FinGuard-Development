<<<<<<< HEAD
# FinGuard-Development
GitHub access for FinGuard AI development
=======
# FinGuard AI - Full Stack Financial Operations Platform

FinGuard AI is an AI-native financial operations application designed for real-time compliance monitoring, fraud detection, automated bank reconciliation, and cash runway projections.

The project is cleanly separated into two independent modules:
- **`client/`**: React + Vite + Tailwind CSS frontend interface.
- **`server/`**: Express + AI Workflow Engine backend server.

---

## 📁 Project Architecture

```text
FINAI/
├── client/                      # Frontend Application (React + Vite)
│   ├── src/                     # App Source Code
│   │   ├── components/          # Reusable UI Components & Modals
│   │   ├── data/                # Initial Default Data & Enums
│   │   ├── pages/               # Page Modules (Dashboard, Invoices, Compliance, etc.)
│   │   ├── services/            # API Client Service (`api.js`)
│   │   ├── App.jsx              # Main Application Container & Router
│   │   ├── main.jsx             # React DOM Entrypoint
│   │   └── index.css            # Tailwind & Custom Utilities
│   ├── index.html               # Entry HTML Document
│   ├── vite.config.js           # Vite Server & API Proxy Config
│   ├── tailwind.config.js       # Design Tokens & Styling Rules
│   └── package.json             # Frontend Manifest
│
├── server/                      # Backend API & AI Agent Engine (Node.js)
│   ├── agent/                   # AI Workflow Engine (`workflowEngine.js`)
│   ├── db/                      # In-Memory Store & Data Models (`store.js`)
│   ├── routes/                  # Express API Endpoints (`api.js`)
│   ├── test/                    # Integration Tests (`api.test.js`)
│   ├── index.js                 # Server Server Entrypoint
│   └── package.json             # Backend Manifest
│
├── README.md                    # Project Documentation
└── package.json                 # Monorepo Workspace & Launcher Scripts
```

---

## 🚀 Getting Started

### 1. Run Full Stack App (Frontend + Backend)

To start both the client dev server (port 3000) and backend server (port 5000) simultaneously:

```bash
npm run dev
```

### 2. Run Only Backend Server

```bash
npm run server
```

Or from the `server/` directory:

```bash
cd server
npm run dev
```

### 3. Run Only Frontend Client

```bash
npm run client
```

Or from the `client/` directory:

```bash
cd client
npm run dev
```

---

## 🧪 Testing & Verification

Run the automated integration test suite for the server API & AI engine:

```bash
npm run test:server
```

Build the production frontend bundle:

```bash
npm run build
```
>>>>>>> dae6e01 (feat: initialize project structure with dashboard UI, server API, and core financial modules)

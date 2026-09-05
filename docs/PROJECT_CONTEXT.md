# Project Context: Money Management Platform

## 1. Project Overview
- **Project Name**: FinanceFlow (Money Management Application)
- **Purpose**: A production-grade personal finance application enabling users to track income/expenses, set budgets, view visual financial analytics, and manage recurring transactions with strict data privacy and security.

## 2. Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Lucide Icons, Axios, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Testing & Tooling**: Postman, ESLint, Prettier

## 3. Architecture Blueprint (Modular Layered Architecture)
```
[ Client (React + Vite) ]
       │  (HTTP / REST API - JSON)
       ▼
[ Routes (Express) ]  ──> Middleware (Auth, Validation, Error Handler)
       │
       ▼
[ Controllers ]  ──> (HTTP Request parsing & HTTP Response formatting ONLY)
       │
       ▼
[ Services ]     ──> (Core Business Logic, Calculations, Rules)
       │
       ▼
[ Models ]       ──> (Mongoose Schemas & DB Queries)
       │
       ▼
[ MongoDB Database ]
```

## 4. Folder Structure Plan
```
money-management-app/
├── docs/
│   ├── PROJECT_CONTEXT.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API_DOCUMENTATION.md
│   ├── CODING_RULES.md
│   ├── FEATURE_LOG.md
│   └── TODO.md
├── server/
│   ├── src/
│   │   ├── config/          # DB connection, env verification
│   │   ├── controllers/     # Controller handlers
│   │   ├── middlewares/     # Auth, error handling, validation
│   │   ├── models/          # Mongoose data models
│   │   ├── routes/          # API route declarations
│   │   ├── services/        # Business logic layer
│   │   ├── utils/           # Helper utilities (response formatters, logger)
│   │   └── app.js           # Express app setup
│   ├── .env.example
│   ├── package.json
│   └── server.js            # Entry point (HTTP server)
└── client/
    ├── src/
    │   ├── api/             # Axios instance & API requests
    │   ├── components/      # UI & Reusable components
    │   ├── context/         # React Context (AuthContext, ThemeContext)
    │   ├── hooks/           # Custom React hooks
    │   ├── pages/           # Page level components
    │   ├── utils/           # Formatting utilities (currency, dates)
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── tailwind.config.js
```

## 5. Feature Breakdown & Roadmap
- [ ] **Phase 1: Foundation & Setup** (Backend Express setup, DB connection, Global Error Handling)
- [ ] **Phase 2: Authentication & User Management** (Register, Login, JWT Middleware, Profile)
- [ ] **Phase 3: Category Management** (Default & Custom categories)
- [ ] **Phase 4: Expense Management** (CRUD, filtering, sorting, pagination)
- [ ] **Phase 5: Income Management** (CRUD, sources)
- [ ] **Phase 6: Budgeting & Goals** (Monthly budgets, category limits)
- [ ] **Phase 7: Analytics & Reporting** (Charts, summary statistics)
- [ ] **Phase 8: Advanced Features** (Recurring transactions, CSV export, Dark mode)

## 6. Coding Standards & Guidelines
- Follow thin controllers, fat services principle.
- Use async/await and central error handling middleware (no unhandled rejections).
- Validate all incoming API inputs.
- Keep codebase clean, modular, and fully documented.
# Architectural Specification: Modular Layered Architecture

## Overview
This application enforces a strict **Modular Layered Architecture** (also known as N-Tier Architecture) on the backend and a **Component-Driven State-Managed Architecture** on the frontend.

## 1. Backend Architecture (Express.js + Node.js)

```
                       ┌─────────────────────────┐
                       │   Client Request (HTTP) │
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │      Router Layer       │
                       └────────────┬────────────┘
                                    │
                        (Middleware: Auth, Validation)
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │    Controller Layer     │ (Thin Controller)
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │      Service Layer      │ (Fat Service: Business Logic)
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │   Model Layer (Mongoose)│
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │     MongoDB Database    │
                       └─────────────────────────┘
```

### Layer Responsibilities
1. **Router Layer (`server/src/routes/`)**
   - Matches incoming URL path and HTTP verb (GET, POST, PUT, DELETE).
   - Applies route-specific middleware (Authentication, Role checks, Input Validation).
   - Delegates request handling to the Controller.

2. **Controller Layer (`server/src/controllers/`)**
   - **Thin Controllers**: No business logic or database queries here!
   - Extracts request data (`req.params`, `req.query`, `req.body`, `req.user`).
   - Invokes the appropriate Service function.
   - Formats the HTTP Response using standard API response helpers (`res.status(code).json(...)`).
   - Catches errors and passes them to `next(err)` for global error handling.

3. **Service Layer (`server/src/services/`)**
   - **Fat Services**: Contains all core business rules, math calculations, data transformations, and orchestration.
   - Interacts with Models to query/mutate the database.
   - Throws descriptive Custom Error objects (`AppError`, `BadRequestError`, `NotFoundError`, etc.) when rules fail.

4. **Model Layer (`server/src/models/`)**
   - Defines Mongoose Schemas, data validation, field types, indexes, and virtual fields.
   - Handles low-level database operations.

5. **Global Error Handling Middleware (`server/src/middlewares/errorHandler.js`)**
   - Catches all operational and syntax errors across the application.
   - Standardizes response structure (`{ success: false, message: "...", errors: [...] }`).
   - Logs errors cleanly in development/production.

---

## 2. Frontend Architecture (React + Vite)

```
[ Router (React Router v6) ]
          │
          ▼
[ Pages (Dashboard, Expenses, Incomes, Budgets, Auth) ]
          │
          ▼
[ Components (Forms, Tables, Charts, Modals, Navbar, Sidebar) ]
          │
          ▼
[ Global Context / State (AuthContext, ExpenseContext) ]
          │
          ▼
[ API Client (Axios Instance with Request/Response Interceptors) ]
```

### Key Architectural Concepts
- **Single Source of Truth**: Global authentication and UI themes are managed via React Context.
- **API Isolation**: All HTTP calls live inside `src/api/` services, never directly in UI components.
- **Interceptors**: Axios request interceptors automatically attach JWT bearer tokens; response interceptors catch 401 Unauthorized errors to handle session logout smoothly.
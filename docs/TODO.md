# Development TODO List

## Phase 1: Core Express Server Setup
- [x] Initialize `server/package.json` with dependencies (`express`, `mongoose`, `dotenv`, `cors`, `helmet`, `morgan`).
- [x] Create environment configuration loader (`server/src/config/db.js` and `env.js`).
- [x] Implement central error handling middleware (`server/src/middlewares/errorHandler.js`).
- [x] Implement standardized response utility (`server/src/utils/response.js`).
- [x] Create `/health` status route and launch Express backend server.

## Phase 2: User Authentication & JWT Security
- [x] Create `User` Mongoose Schema with password hashing hooks (`bcryptjs`).
- [x] Implement `authService` (register, login, generateToken).
- [x] Implement `authController` and `/api/v1/auth` routes.
- [x] Create JWT validation middleware (`server/src/middlewares/authMiddleware.js`).

## Phase 3: Categories & Transaction Foundations
- [x] Create `Category` model and seed script for default categories.
- [x] Implement `categoryService`, `categoryController`, and `/api/v1/categories` routes.

## Phase 4: Expense Management Module
- [x] Create `Expense` model with validation rules.
- [x] Implement `expenseService` (create, get list with pagination/filtering, update, delete).
- [x] Implement `expenseController` and `/api/v1/expenses` routes.

## Phase 5: Income Management Module
- [x] Create `Income` model.
- [x] Implement `incomeService`, `incomeController`, and `/api/v1/incomes` routes.

## Phase 6: Budgeting System
- [x] Create `Budget` model with month/year compound index.
- [x] Implement budget calculation logic and alert middleware.

## Phase 7: Analytics & Aggregation
- [x] Create multi-model `dashboardService` (`/summary`, `/charts`, `/recent`).
- [x] Implement `dashboardController` and `/api/v1/dashboard` routes.

## Phase 8: Production React Frontend
- [x] Configure Vite, Tailwind CSS, and Lucide Icons in `client/`.
- [x] Create Axios API client with request token & 401 response interceptors (`src/api/`).
- [x] Build `AuthContext` and `ThemeContext` global providers.
- [x] Build Recharts visual components (`CategoryPieChart`, `MonthlyTrendChart`).
- [x] Build full SPA pages (`Login`, `Register`, `Dashboard`, `Expenses`, `Incomes`, `Budgets`).
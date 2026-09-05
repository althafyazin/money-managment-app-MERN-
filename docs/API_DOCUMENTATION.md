# REST API Specification

Standard API Base URL: `http://localhost:5000/api/v1`

Standard JSON Response Structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```
Standard Error Response Structure:
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [ "Email is already registered" ]
}
```

---

## 1. System & Health Check
- `GET /health` - Check backend server & database connectivity status.

## 2. Authentication (`/api/v1/auth`)
- `POST /auth/register` - Register new user account.
- `POST /auth/login` - Authenticate user & issue JWT token.
- `GET /auth/me` - Get current authenticated user profile (Protected).
- `POST /auth/logout` - Logout user.

## 3. Categories (`/api/v1/categories`)
- `GET /categories` - List user & default categories (Protected).
- `POST /categories` - Create custom category (Protected).
- `DELETE /categories/:id` - Delete custom category (Protected).

## 4. Expenses (`/api/v1/expenses`)
- `GET /expenses` - List user expenses with pagination & filters (Protected).
- `POST /expenses` - Create expense (Protected).
- `GET /expenses/:id` - Get expense details (Protected).
- `PUT /expenses/:id` - Update expense (Protected).
- `DELETE /expenses/:id` - Delete expense (Protected).

## 5. Incomes (`/api/v1/incomes`)
- `GET /incomes` - List user incomes with pagination & filters (Protected).
- `POST /incomes` - Create income record (Protected).
- `PUT /incomes/:id` - Update income record (Protected).
- `DELETE /incomes/:id` - Delete income record (Protected).

## 6. Budgets (`/api/v1/budgets`)
- `GET /budgets` - List budgets and budget vs spent progress (Protected).
- `POST /budgets` - Set/Create budget for category (Protected).
- `PUT /budgets/:id` - Update budget limit (Protected).

## 7. Analytics & Dashboard (`/api/v1/dashboard`)
- `GET /dashboard/summary` - Total income, total expenses, net balance, monthly breakdown (Protected).
- `GET /dashboard/charts` - Category-wise spending breakdown for charts (Protected).
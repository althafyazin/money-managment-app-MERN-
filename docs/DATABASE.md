# Database Schema & Data Models Design

## Database Strategy: MongoDB with Mongoose ODM

### Entity Relationship Overview
```
           ┌──────────────┐
           │     User     │
           └──────┬───────┘
                  │ (1 : N)
     ┌────────────┼────────────┬─────────────┐
     ▼            ▼            ▼             ▼
┌─────────┐  ┌─────────┐  ┌──────────┐  ┌──────────────┐
│ Expense │  │ Income  │  │  Budget  │  │ Notification │
└────┬────┘  └────┬────┘  └────┬─────┘  └──────────────┘
     │            │            │
     └────────────┼────────────┘
                  │ (N : 1)
                  ▼
          ┌──────────────┐
          │   Category   │
          └──────────────┘
```

---

## Data Schemas

### 1. User Schema (`server/src/models/User.js`)
- `name` (String, Required, Trimmed)
- `email` (String, Required, Unique, Lowercase, Trimmed, Indexed)
- `password` (String, Required, Min length: 6, Hashed via bcrypt)
- `avatarUrl` (String, Optional)
- `currency` (String, Default: "USD")
- `isEmailVerified` (Boolean, Default: false)
- `createdAt` / `updatedAt` (Timestamps)

### 2. Category Schema (`server/src/models/Category.js`)
- `user` (ObjectId ref User, Nullable if system default)
- `name` (String, Required, Trimmed)
- `type` (String, Enum: ["expense", "income"], Required)
- `icon` (String, Default: "tag")
- `color` (String, Hex code, Default: "#6B7280")
- `isCustom` (Boolean, Default: false)
- `createdAt` / `updatedAt` (Timestamps)

### 3. Expense Schema (`server/src/models/Expense.js`)
- `user` (ObjectId ref User, Required, Indexed)
- `title` (String, Required, Trimmed)
- `amount` (Number, Required, Min: 0.01)
- `category` (ObjectId ref Category, Required, Indexed)
- `date` (Date, Required, Default: Date.now, Indexed)
- `paymentMethod` (String, Enum: ["cash", "credit_card", "debit_card", "bank_transfer", "other"], Default: "debit_card")
- `notes` (String, Max length: 500)
- `isRecurring` (Boolean, Default: false)
- `recurringFrequency` (String, Enum: ["daily", "weekly", "monthly", "yearly"], Optional)
- `createdAt` / `updatedAt` (Timestamps)

### 4. Income Schema (`server/src/models/Income.js`)
- `user` (ObjectId ref User, Required, Indexed)
- `source` (String, Required, Trimmed)
- `amount` (Number, Required, Min: 0.01)
- `category` (ObjectId ref Category, Required, Indexed)
- `date` (Date, Required, Default: Date.now, Indexed)
- `notes` (String, Max length: 500)
- `isRecurring` (Boolean, Default: false)
- `createdAt` / `updatedAt` (Timestamps)

### 5. Budget Schema (`server/src/models/Budget.js`)
- `user` (ObjectId ref User, Required, Indexed)
- `category` (ObjectId ref Category, Required, Indexed)
- `amountLimit` (Number, Required, Min: 1)
- `month` (Number, Required, Min: 1, Max: 12)
- `year` (Number, Required, Min: 2024)
- `createdAt` / `updatedAt` (Timestamps)

### 6. Notification Schema (`server/src/models/Notification.js`)
- `user` (ObjectId ref User, Required, Indexed)
- `type` (String, Enum: ["budget_exceeded", "budget_warning", "recurring_due", "system"], Required)
- `message` (String, Required)
- `isRead` (Boolean, Default: false)
- `createdAt` (Timestamp)

---

## Indexing Strategy for High Performance
- `User`: Unique index on `email`.
- `Expense`: Compound index `{ user: 1, date: -1 }` and `{ user: 1, category: 1 }`.
- `Income`: Compound index `{ user: 1, date: -1 }`.
- `Budget`: Compound unique index `{ user: 1, category: 1, month: 1, year: 1 }`.
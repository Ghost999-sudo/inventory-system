# Inventory & Sales Management System

Frontend starter for an inventory and sales management system built with React, Vite, Redux Toolkit, React Router, Axios, Recharts, and offline/PWA support.

The backend lives in `inventory-management-backend/` and is built with Spring Boot, MySQL, JWT security, WebSockets, and offline sync endpoints.

## What is included

- JWT login flow with protected, role-aware routes
- Role-specific dashboards for admin, manager, accountant, cashier, store keeper, supplier, and customer users
- POS page with cart and checkout flow
- Inventory and products management screens
- Customers, suppliers, and reports pages
- REST API service layer
- WebSocket hook
- IndexedDB offline queue helpers
- PWA service worker and manifest

## Setup

```bash
npm install
npm run dev
```

The app no longer creates sample users, products, customers, suppliers, sales, or report data. Account creation is admin-only: provision the initial admin account, sign in, then add and confirm all other users from **Settings**.

## Environment

Copy `.env.example` to `.env` and update the values for your backend.

## Next step

Run the frontend from the repo root, and run the backend from `inventory-management-backend/`.

# Inventory & Sales Management System

Frontend starter for an inventory and sales management system built with React, Vite, Redux Toolkit, React Router, Axios, Recharts, and offline/PWA support.

The backend lives in `inventory-management-backend/` and is built with Spring Boot, MySQL, JWT security, WebSockets, and offline sync endpoints.

## What is included

- Login flow with protected routes
- Dashboard with summary cards and charts
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

## Environment

Copy `.env.example` to `.env` and update the values for your backend.

## Next step

Run the frontend from the repo root, and run the backend from `inventory-management-backend/`.

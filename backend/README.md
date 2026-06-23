# Inventory Management Backend

Spring Boot backend for the inventory and sales management system.

## Included

- JWT authentication
- Product, customer, supplier, sales, and payment APIs
- M-Pesa payment scaffolding
- Dashboard report endpoint
- Offline sync batch endpoint
- Raw WebSocket stock updates at `/ws`

## Run locally

1. Create a MySQL database or let Spring create it automatically.
2. Update `src/main/resources/application.properties`.
3. Run:

```bash
mvn spring-boot:run
```

## Admin-only account setup

No demo users are created, and public registration is disabled. Provision the initial admin account for a fresh database, sign in as that admin, then create and confirm all other users from **Settings**.

## Main endpoints

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/products`
- `POST /api/sales`
- `POST /api/payments/mpesa/request`
- `GET /api/reports/dashboard`
- `POST /api/sync/batch`

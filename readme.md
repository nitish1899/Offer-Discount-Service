# Offer Discount Service

A backend service built with **Express.js** and **MikroORM** that allows merchants or internal teams to:

- Upload and store bank offers.
- Query the best discount available based on transaction amount, payment method, and bank.

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL
- pnpm (or npm/yarn)

### Setup Instructions

1. **Clone the repo**

```bash
git clone https://github.com/your-repo/offer-discount-service.git
cd offer-discount-service
```

## 2. Install dependencies

- npm install

## 3. Configure environment

```
DB_NAME=offer-discount-service
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

PORT=5000

```
## 4. Check pending migration 
```
npx mikro-orm migration:pending
```

## 5. Run migrations
```
npx mikro-orm migration:up
```

## 6. Start the server
- npm run dev
- Server will run on: http://localhost:5000

## 7. Assumptions
- Authentication is not implemented. This was skipped for brevity and because the prompt focused on offer ingestion and querying.

- Multiple banks and payment instruments can be associated with a single offer.

- All offers are time-invariant (no expiration date/time constraint was included).

- Only active offers (is_active: true) are considered.

- You may receive multiple offers per request, but only the one with maximum discount will be returned.

## 8. Design Decisions
### Framework
- Express.js – Lightweight, flexible, and quick to set up for a service of this size.

- MikroORM – TypeScript-first ORM with good PostgreSQL support, easy migrations, and entity lifecycle hooks.

### Database Schema
- Offers are stored in a single table with columns:

-- adjustment_id (unique)

-- title, summary, discount_amount, etc.

-- bank_name and payment_instrument are stored as arrays to support multiple values per offer.

- Indexes are used on frequently queried fields (discount_amount, bank_name, etc.)


### Scaling /highest-discount for 1000 RPS

To handle 1,000 requests per second, the following changes would help:

1. PostgreSQL Optimization:

- Add indexes on: bank_name, payment_instrument, min_txn_value, max_txn_value, is_active.

- Use GIN index for array fields (bank_name, payment_instrument) for efficient lookup.

2. Caching:

- Use Redis to cache frequently queried discounts (e.g., per (bankName, instrument, amount) key).

- Invalidate cache when new offers are posted.

3. Horizontal Scaling:

- Run multiple instances behind a load balancer (e.g., Nginx, AWS ALB).

- Database Connection Pooling:

4. Use connection pooling with pg-pool or a pool manager to avoid overload.


### Improvements If I Had More Time
- Add authentication/authorization with JWT or OAuth (per role access).

- Add offer expiry time and filtering based on valid_till.

- Rate limiting to protect /highest-discount.

- Pagination on GET offers endpoint (if needed).

- Write unit + integration tests for controller and DB logic.

- Add Swagger/OpenAPI docs.

- Move hardcoded logic to services layer for better separation of concerns.


### Authentication Status
Authentication has not been implemented in this version. In a production setting:

- All POST routes should be protected with an authentication layer.

- GET routes should apply rate limiting and optional auth if needed.

- Token-based auth (JWT) with roles (admin, merchant) would be ideal.


### API Routes
```
POST /offers
Bulk insert offers.
```

###  GET /offers/highest-discount
Returns the best discount given:
- amount
- bankName
- paymentInstrument

```
 GET /offers/highest-discount?amount=1000&bankName=HDFC&paymentInstrument=CREDIT_CARD
```

### 📂 Folder Structure
```
src/
├── controllers/
│   └── offer.controller.ts
├── entities/
│   └── offer.entity.ts
├── routes/
│   └── offer.routes.ts
├── services/
│   └── offer.service.ts
├── index.ts
```


### Tech Stack
- Node.js
- Express.js
- MikroORM
- PostgreSQL
- TypeScript

### Author
Developed by Nitish Kumar

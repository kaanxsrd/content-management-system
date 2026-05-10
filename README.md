# SchoolApp — CMS Full-Stack Project

A full-stack Content Management System built as a school project, consisting of a **.NET 10 REST API** backend and a **Next.js 16 admin dashboard** frontend.

| Layer | Technology | Purpose |
|---|---|---|
| Backend | .NET 10 + EF Core 9 + PostgreSQL | REST API, business logic, persistence |
| Frontend | Next.js 16 + React 19 + shadcn/ui | Admin dashboard + public shop |
| Auth | Clerk | User identity, organizations, RBAC |
| Payments | Stripe | Product checkout |
| Database | PostgreSQL (Docker) | Relational data store |

---

## Project Structure

```
SchoolOOP/
├── CmsBackend/       .NET 10 API  (DDD · CQRS · Clean Architecture)
└── CmsFrontend/      Next.js 16   (App Router · React Query · shadcn/ui)
```

---

## System Architecture

```
╔══════════════════════════════════════════════════════════════════════════╗
║                              BROWSER                                     ║
║                                                                          ║
║   ┌────────────────────────┐        ┌─────────────────────────────────┐ ║
║   │    /dashboard/*        │        │        /shop/[org]/*            │ ║
║   │  Admin Dashboard       │        │   Public Storefront             │ ║
║   │  (Clerk protected)     │        │   (no auth required)            │ ║
║   │                        │        │                                 │ ║
║   │  ▸ Overview / Charts   │        │  ▸ Product listing              │ ║
║   │  ▸ Product management  │        │  ▸ Product detail               │ ║
║   │  ▸ Customer management │        │  ▸ Stripe checkout              │ ║
║   │  ▸ Order management    │        │  ▸ Order history                │ ║
║   │  ▸ Workspaces / Billing│        │                                 │ ║
║   └──────────┬─────────────┘        └──────────────┬──────────────────┘ ║
╚═════════════╪════════════════════════════════════╪═════════════════════╝
              │                                    │
              │ React Query                        │ fetch + Route Handlers
              │ useSuspenseQuery                   │ /api/*
              ▼                                    ▼
╔══════════════════════════════════════════════════════════════════════════╗
║                        NEXT.JS SERVER  (CmsFrontend)                     ║
║                                                                          ║
║   Server Components ──► prefetchQuery ──► service.ts ('use server')      ║
║   dehydrate()       ──► HydrationBoundary ──► client reuses cache        ║
║                                                                          ║
║   /api/checkout           ──────────────────────► Stripe API             ║
║   /api/webhooks/stripe    ◄────────────────────── Stripe Webhook         ║
║   /api/shop/orders        ──┐                                            ║
║   /api/crm/orders/*       ──┤                                            ║
╚════════════════════════════╪═════════════════════════════════════════════╝
                             │ HTTP  ·  X-API-Key header
                             ▼
╔══════════════════════════════════════════════════════════════════════════╗
║                       .NET 10 API  (CmsBackend)                          ║
║                                                                          ║
║   ApiKeyAuthMiddleware ──► Controllers ──► MediatR                       ║
║                                │                                         ║
║                    ┌───────────┴───────────┐                             ║
║                    ▼                       ▼                             ║
║             Commands (write)         Queries (read)                      ║
║             FluentValidation         Repository                          ║
║             Domain Aggregate         Result<T>                           ║
╚════════════════════════════════════╪═════════════════════════════════════╝
                                     │ EF Core 9
                                     ▼
╔══════════════════════════════════════════════════════════════════════════╗
║                           PostgreSQL                                     ║
║   ApiKeys · Customers · Products · Orders · OrderItems · Addresses       ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## Backend — Clean Architecture

```
CmsBackend/
│
├── Api/                  HTTP layer
│   ├── Controllers/      REST endpoints (Products, Customers, Orders,
│   │                     Addresses, ApiKeys, Stats, Dashboard)
│   ├── Middleware/       ApiKeyAuth · ExceptionHandler · RequestLogger
│   └── Contracts/        Request / Response DTOs
│
├── Application/          Use-case layer (CQRS via MediatR)
│   ├── Commands/         Write operations  (CreateProduct, CreateOrder…)
│   ├── Queries/          Read operations   (GetAllProducts, GetOrderById…)
│   ├── Behaviours/       ValidationBehaviour (FluentValidation pipeline)
│   └── Abstractions/     ICommand · IQuery · IRepository interfaces
│
├── Domain/               Core business rules
│   ├── Customer          AggregateRoot
│   ├── Product           AggregateRoot
│   ├── Order             AggregateRoot + OrderItem entity
│   ├── ApiKey            AggregateRoot
│   ├── Common/           AggregateRoot base · Entity · Result<T>
│   └── Events/           CustomerCreated · OrderCreated · ProductCreated
│
└── Infrastructure/       External concerns
    ├── AppDbContext       EF Core (PostgreSQL)
    └── Repositories/     CustomerRepo · ProductRepo · OrderRepo …
```

### CQRS Request Flow

```
  HTTP Request
       │
  ┌────▼──────────────┐
  │  ApiKey Middleware │  validates X-API-Key against DB (bcrypt)
  └────┬──────────────┘
       │
  ┌────▼──────────────┐
  │    Controller      │  maps DTO  →  ICommand / IQuery
  └────┬──────────────┘
       │
  ┌────▼──────────────────────────────┐
  │         MediatR Pipeline           │
  │   ValidationBehaviour              │  FluentValidation runs here
  └────┬─────────────────────┬────────┘
       │                     │
  ┌────▼────────┐      ┌──────▼────────┐
  │   Command   │      │    Query      │
  │   Handler   │      │   Handler     │
  │  (writes)   │      │  (reads)      │
  └────┬────────┘      └──────┬────────┘
       │                      │
  ┌────▼──────────────────────▼────────┐
  │            Domain Layer             │
  │   Aggregate enforces invariants     │
  │   Raises DomainEvents on mutation   │
  └────────────────┬───────────────────┘
                   │
  ┌────────────────▼───────────────────┐
  │           Repository               │  AppDbContext → PostgreSQL
  └────────────────┬───────────────────┘
                   │
  ┌────────────────▼───────────────────┐
  │           Result<T>                │  Ok(value) / Error(msg)
  └────────────────────────────────────┘  propagated to Controller → HTTP
```

---

## Database Schema (ERD)

```
┌──────────────────┐          ┌───────────────────────────┐
│    Addresses     │          │         Customers          │
├──────────────────┤          ├───────────────────────────┤
│ Id        (PK)   │◄─────────│ Id            (PK)        │
│ Street           │  1    N  │ FirstName                 │
│ City             │          │ LastName                  │
│ ZipCode          │          │ Email                     │
│ Country          │          │ AddressId     (FK) ───────┘
└──────────────────┘          └──────────────┬────────────┘
       ▲                                      │ 1
       │ shipping                             │ places
       │ address                              │ N
       │                          ┌───────────▼────────────┐
       └──────────────────────────│          Orders         │
                         FK       ├────────────────────────┤
                                  │ Id            (PK)     │
                                  │ CustomerId    (FK)     │
                                  │ ShippingAddressId (FK) │
                                  │ Status        (enum)   │
                                  │ CreatedAtUtc           │
                                  └───────────┬────────────┘
                                              │ 1
                                              │ contains
                                              │ N
                                  ┌───────────▼────────────┐        ┌──────────────────┐
                                  │       OrderItems        │        │     Products     │
                                  ├────────────────────────┤        ├──────────────────┤
                                  │ Id            (PK)     │        │ Id        (PK)   │
                                  │ OrderId       (FK)     │  N   1 │ Name             │
                                  │ ProductId     (FK) ────┼────────│ Description      │
                                  │ Quantity               │        │ Price            │
                                  │ UnitPrice              │        │ ImageUrl         │
                                  └────────────────────────┘        │ IsActive         │
                                                                     │ Stock            │
                                                                     └──────────────────┘

┌─────────────────────────────┐      ┌──────────────────────────────────┐
│          ApiKeys            │      │        BackendRequestLogs         │
├─────────────────────────────┤      ├──────────────────────────────────┤
│ Id              (PK)        │      │ Id               (PK)            │
│ Name                        │      │ Path                             │
│ KeyHash  (bcrypt)           │      │ Method                           │
│ IsActive                    │      │ StatusCode                       │
│ CreatedAtUtc                │      │ ResponseTimeMs                   │
│ LastUsedAtUtc               │      └──────────────────────────────────┘
│ TotalRequests               │
└─────────────────────────────┘
```

### Order Status State Machine

```
             ┌──────────┐
             │  Pending │
             └────┬─────┘
                  │ confirm
                  ▼
             ┌────────────┐
             │ Confirmed  │
             └────┬───────┘
                  │ ship
                  ▼
             ┌──────────┐
             │  Shipped │
             └────┬─────┘
                  │ deliver
                  ▼
             ┌───────────┐
             │ Delivered │
             └───────────┘

  cancel available from: Pending · Confirmed · Shipped
```

---

## Frontend — Feature Module Pattern

```
CmsFrontend/src/
│
├── app/                     Next.js App Router
│   ├── auth/                Clerk sign-in / sign-up
│   ├── shop/[org]/          Public storefront (no auth)
│   │   ├── page.tsx         Product grid
│   │   ├── [productId]/     Product detail
│   │   ├── success/         Post-checkout confirmation
│   │   └── orders/          Customer order history
│   ├── dashboard/           Protected admin area
│   │   ├── overview/        Stats + parallel route charts
│   │   ├── product/         Product CRUD table
│   │   ├── customers/       Customer CRUD table
│   │   ├── orders/          Order management table
│   │   ├── workspaces/      Clerk org management
│   │   └── billing/         Clerk billing
│   └── api/                 Route handlers (proxy + Stripe)
│
├── features/                One folder per domain
│   ├── products/
│   │   ├── api/
│   │   │   ├── types.ts     TypeScript types (mirrors backend)
│   │   │   ├── service.ts   'use server' fetch functions
│   │   │   ├── queries.ts   React Query key factories
│   │   │   └── mutations.ts useMutation option objects
│   │   └── components/      ProductListing · ProductForm · …
│   ├── customers/           (same pattern)
│   ├── orders/              (same pattern)
│   └── overview/            Charts (Recharts)
│
├── components/ui/           shadcn/ui primitives
├── lib/cms-api-client.ts    HTTP client → CmsBackend (X-API-Key)
└── config/nav-rbac.ts       Sidebar links filtered by Clerk role
```

### React Query Data Flow

```
  ┌──────────────────────────────────────────────────────────────────┐
  │  Server Component  (page.tsx)                                    │
  │                                                                  │
  │  prefetchQuery(productsQueryOptions())                           │
  │       └──► service.ts  ──► cmsApiClient  ──► CmsBackend         │
  │                                                                  │
  │  <HydrationBoundary state={dehydrate(queryClient)}>             │
  │    <ProductListing />                                            │
  │  </HydrationBoundary>                                            │
  └──────────────────────────────────────────────────────────────────┘
                              │ serialized state passed to client
  ┌──────────────────────────────────────────────────────────────────┐
  │  Client Component  (product-listing.tsx)                        │
  │                                                                  │
  │  useSuspenseQuery(productsQueryOptions())                        │
  │       └──► hits cache (no extra HTTP request on hydration)      │
  │                                                                  │
  │  useMutation(createProductMutation())                            │
  │       └──► on success: invalidateQueries(productKeys.all())     │
  │                        └──► list refetches automatically        │
  └──────────────────────────────────────────────────────────────────┘
```

### Stripe Checkout Flow

```
  Browser                  Next.js Server              External
  ───────                  ──────────────              ────────
  click "Buy"
      │
      ├──POST /api/checkout──────────────────────► Stripe
      │                                            creates session
      │◄── redirect to stripe.com ─────────────────────────────────┐
      │                                                             │
      │  (user pays on Stripe hosted page)                         │
      │                                                             │
      ├──GET /shop/[org]/success?session_id=... ◄──────────────────┘
      │
      ├──POST /api/shop/process-checkout
      │         verifies session ─────────────────────► Stripe
      │         creates order ──────────────────────► CmsBackend
      │
      └── show confirmation page
```

---

## API Reference

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/crm/products` | Create product |
| `GET` | `/api/crm/products` | List products |
| `GET` | `/api/crm/products/{id}` | Get product |
| `PUT` | `/api/crm/products/{id}` | Update product |
| `PATCH` | `/api/crm/products/{id}/deactivate` | Deactivate |
| `PATCH` | `/api/crm/products/{id}/stock` | Update stock |
| `POST` | `/api/crm/customers` | Create customer |
| `GET` | `/api/crm/customers` | List customers |
| `GET` | `/api/crm/customers/{id}` | Get customer |
| `GET` | `/api/crm/customers/by-email` | Find by email |
| `PUT` | `/api/crm/customers/{id}/email` | Update email |
| `POST` | `/api/crm/orders` | Create order |
| `GET` | `/api/crm/orders` | List orders |
| `GET` | `/api/crm/orders/{id}` | Get order |
| `GET` | `/api/crm/orders/by-customer/{id}` | Orders by customer |
| `GET` | `/api/crm/orders/by-email/{email}` | Orders by email |
| `PATCH` | `/api/crm/orders/{id}/confirm` | Confirm order |
| `PATCH` | `/api/crm/orders/{id}/ship` | Ship order |
| `PATCH` | `/api/crm/orders/{id}/deliver` | Deliver order |
| `PATCH` | `/api/crm/orders/{id}/cancel` | Cancel order |
| `POST` | `/api/crm/addresses` | Create address |
| `GET` | `/api/crm/addresses/{id}` | Get address |
| `GET` | `/api/admin/api-keys` | List API keys |
| `POST` | `/api/admin/api-keys` | Create API key |
| `GET` | `/api/admin/stats` | Dashboard stats |

All routes except `/health` require `X-API-Key` header.

---

## Running Locally

### Backend

```bash
cd CmsBackend

# Start PostgreSQL
docker-compose up -d

# Apply migrations
dotnet ef database update

# Run API (default port 5000)
dotnet run --mode api
```

### Frontend

```bash
cd CmsFrontend

# Install dependencies
bun install

# Copy and fill environment variables
cp env.example.txt .env.local
# Required: CMS_BACKEND_URL, CMS_API_KEY,
#           NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY,
#           STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Start dev server (port 3000)
bun run dev
```

### Environment Variables

| Variable | Where | Description |
|---|---|---|
| `CMS_BACKEND_URL` | Frontend | URL of the .NET API (default `http://localhost:5000`) |
| `CMS_API_KEY` | Frontend | API key sent as `X-API-Key` to backend |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Frontend | Clerk public key |
| `CLERK_SECRET_KEY` | Frontend | Clerk server key |
| `STRIPE_SECRET_KEY` | Frontend | Stripe server key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Frontend | Stripe public key |
| `ConnectionStrings__DefaultConnection` | Backend | PostgreSQL connection string |

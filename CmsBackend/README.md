# CmsBackend

.NET 10 REST API built with Domain-Driven Design, CQRS, and Clean Architecture.

---

## Clean Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                     API Layer                        │
│   Controllers · Middleware · Contracts (DTOs)        │
└────────────────────┬────────────────────────────────┘
                     │ depends on
┌────────────────────▼────────────────────────────────┐
│                Application Layer                     │
│   Commands · Queries · Handlers · Validators         │
│   MediatR pipeline · FluentValidation behaviours     │
└──────────┬──────────────────────────────────────────┘
           │ depends on (interfaces only)
┌──────────▼──────────────────────────────────────────┐
│                  Domain Layer                        │
│   AggregateRoot · Entities · Value Objects           │
│   Domain Events · Result<T> pattern                  │
└─────────────────────────────────────────────────────┘
           ▲ implements
┌──────────┴──────────────────────────────────────────┐
│              Infrastructure Layer                    │
│   EF Core Repositories · AppDbContext · PostgreSQL   │
└─────────────────────────────────────────────────────┘
```

---

## CQRS Request Flow

```
                        HTTP Request
                             │
                      ┌──────▼──────┐
                      │ API Key Auth │  X-API-Key header
                      │ Middleware   │  validated against DB
                      └──────┬──────┘
                             │
                      ┌──────▼──────┐
                      │  Controller │
                      └──────┬──────┘
                             │  maps Request DTO →
                  ┌──────────┴──────────┐
                  │                     │
           ┌──────▼──────┐       ┌──────▼──────┐
           │   Command   │       │    Query    │
           │  (write op) │       │  (read op)  │
           └──────┬──────┘       └──────┬──────┘
                  │                     │
           ┌──────▼─────────────────────▼──────┐
           │        MediatR Pipeline            │
           │   ValidationBehaviour (FluentVal.) │
           └──────┬─────────────────────┬──────┘
                  │                     │
    ┌─────────────▼───────┐   ┌─────────▼───────────┐
    │  ICommandHandler<T> │   │  IQueryHandler<T,R> │
    │   writes via repo   │   │   reads via repo    │
    └─────────────┬───────┘   └─────────┬───────────┘
                  │                     │
           ┌──────▼─────────────────────▼──────┐
           │         Domain / Aggregate         │
           │   enforces invariants, emits       │
           │   DomainEvents on state change     │
           └──────────────┬────────────────────┘
                          │
                   ┌──────▼──────┐
                   │  Repository │  AppDbContext
                   │             │  PostgreSQL
                   └──────┬──────┘
                          │
                   ┌──────▼──────┐
                   │  Result<T>  │  Ok / Error propagated
                   │             │  back to Controller
                   └─────────────┘
```

---

## Database Schema (ERD)

```
┌──────────────────┐        ┌──────────────────────┐
│    Addresses     │        │      Customers        │
├──────────────────┤        ├──────────────────────┤
│ Id         (PK)  │◄───────│ Id           (PK)    │
│ Street           │  1     │ FirstName             │
│ City             │  │     │ LastName              │
│ ZipCode          │  │     │ Email                 │
│ Country          │  └─────│ AddressId    (FK)     │
└──────────────────┘        └──────────┬───────────┘
                                       │ 1
                                       │ places
                                       │ N
                             ┌─────────▼───────────┐        ┌──────────────────┐
                             │       Orders         │        │    Addresses     │
                             ├─────────────────────┤        ├──────────────────┤
                             │ Id           (PK)   │        │ (same table,     │
                             │ CustomerId   (FK) ──┘        │  used as ship-   │
                             │ ShippingAddressId(FK)────────│  ping address)   │
                             │ Status (enum)       │        └──────────────────┘
                             │ CreatedAtUtc        │
                             └──────────┬──────────┘
                                        │ 1
                                        │ contains
                                        │ N
                             ┌──────────▼──────────┐        ┌──────────────────┐
                             │     OrderItems       │        │     Products     │
                             ├─────────────────────┤        ├──────────────────┤
                             │ Id           (PK)   │        │ Id         (PK)  │
                             │ OrderId      (FK)   │        │ Name             │
                             │ ProductId    (FK) ──┼────────│ Description      │
                             │ Quantity            │  N   1 │ Price            │
                             │ UnitPrice           │        │ ImageUrl         │
                             └─────────────────────┘        │ IsActive         │
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
  ┌──────────┐   confirm   ┌───────────┐   ship   ┌──────────┐  deliver  ┌───────────┐
  │  Pending │────────────►│ Confirmed │──────────►│ Shipped  │──────────►│ Delivered │
  └──────────┘             └─────┬─────┘           └─────┬────┘           └───────────┘
       │                         │                        │
       │ cancel                  │ cancel                 │ cancel
       ▼                         ▼                        ▼
  ┌──────────┐             ┌───────────┐           ┌──────────┐
  │Cancelled │             │ Cancelled │           │Cancelled │
  └──────────┘             └───────────┘           └──────────┘
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/crm/products` | Create product |
| `GET` | `/api/crm/products` | List all products |
| `GET` | `/api/crm/products/{id}` | Get product by ID |
| `PUT` | `/api/crm/products/{id}` | Update product |
| `PATCH` | `/api/crm/products/{id}/deactivate` | Deactivate product |
| `PATCH` | `/api/crm/products/{id}/stock` | Update stock |
| `POST` | `/api/crm/customers` | Create customer |
| `GET` | `/api/crm/customers` | List all customers |
| `GET` | `/api/crm/customers/{id}` | Get customer by ID |
| `GET` | `/api/crm/customers/by-email` | Get customer by email |
| `PUT` | `/api/crm/customers/{id}/email` | Update customer email |
| `POST` | `/api/crm/orders` | Create order |
| `GET` | `/api/crm/orders` | List all orders |
| `GET` | `/api/crm/orders/{id}` | Get order by ID |
| `GET` | `/api/crm/orders/by-customer/{customerId}` | Orders by customer |
| `GET` | `/api/crm/orders/by-email/{email}` | Orders by email |
| `PATCH` | `/api/crm/orders/{id}/confirm` | Confirm order |
| `PATCH` | `/api/crm/orders/{id}/ship` | Ship order |
| `PATCH` | `/api/crm/orders/{id}/deliver` | Deliver order |
| `PATCH` | `/api/crm/orders/{id}/cancel` | Cancel order |
| `POST` | `/api/crm/addresses` | Create address |
| `GET` | `/api/crm/addresses/{id}` | Get address |
| `GET` | `/api/admin/api-keys` | List API keys |
| `POST` | `/api/admin/api-keys` | Create API key |
| `GET` | `/api/admin/stats` | Dashboard statistics |

All routes (except `/health`) require `X-API-Key` header.

---

## Tech Stack

| | |
|---|---|
| Runtime | .NET 10 |
| ORM | Entity Framework Core 9 + Npgsql |
| Database | PostgreSQL (Docker) |
| Mediator | MediatR 12 |
| Validation | FluentValidation 11 |
| API docs | Swagger / OpenAPI |
| Auth | API Key (bcrypt hashed) |

## Running Locally

```bash
# Start PostgreSQL
docker-compose up -d

# Apply migrations
dotnet ef database update

# Run API
dotnet run --mode api

# Run console UI
dotnet run --mode console
```

# Dashboard Specification

## Purpose

Role-aware dashboard providing summary cards and quick actions. ADMIN sees system totals; OPERATOR sees personal pending orders.

## Requirements

### Requirement: Admin Dashboard

The system SHALL display an ADMIN dashboard at `/dashboard` with: total product count, low-stock product count (preview), pending order count, and quick-action buttons to create a product or order.

#### Scenario: Admin dashboard loads data

- GIVEN the user is authenticated as ADMIN
- WHEN the user navigates to `/dashboard`
- THEN the system calls `GET /api/products` and `GET /api/orders?status=PENDING`
- AND displays: total products count, low-stock count (products where `stock <= minStock`), pending orders count

#### Scenario: Admin quick actions

- GIVEN the admin is on `/dashboard`
- WHEN the dashboard renders
- THEN "Create Product" and "Create Order" buttons are visible
- AND clicking "Create Product" navigates to `/products/new`
- AND clicking "Create Order" navigates to `/orders/new`

### Requirement: Operator Dashboard

The system SHALL display an OPERATOR dashboard at `/dashboard` with: pending orders count (own only), quick-action to create an order, and a preview of available products.

#### Scenario: Operator dashboard loads data

- GIVEN the user is authenticated as OPERATOR
- WHEN the user navigates to `/dashboard`
- THEN the system calls `GET /api/orders?status=PENDING`
- AND displays: pending orders count for the current operator

#### Scenario: Operator quick action

- GIVEN the operator is on `/dashboard`
- WHEN the dashboard renders
- THEN a "Create Order" button is visible
- AND clicking it navigates to `/orders/new`

### Requirement: Dashboard Loading States

The system SHALL display skeleton cards while dashboard data is loading. Each data card SHALL independently show loading state.

#### Scenario: Dashboard loading

- GIVEN dashboard data is being fetched
- WHEN data has not arrived
- THEN skeleton cards are displayed in place of each metric

### Requirement: Dashboard Error Handling

The system SHALL display error messages for individual data cards that fail to load, without blocking other cards.

#### Scenario: Partial data failure

- GIVEN the products API fails but orders API succeeds
- WHEN the dashboard renders
- THEN the products card shows an error state
- AND the orders card shows the correct count

## Dependencies

- API Client capability
- TanStack Query for data fetching
- Auth capability (for user role and token)

## Acceptance Criteria

- [ ] ADMIN dashboard shows total products, low-stock count, pending orders
- [ ] ADMIN dashboard has quick-action buttons for product and order creation
- [ ] OPERATOR dashboard shows own pending orders count
- [ ] OPERATOR dashboard has quick-action button for order creation
- [ ] Skeleton cards shown during loading
- [ ] Individual card errors don't block other cards
- [ ] Quick actions navigate to correct routes

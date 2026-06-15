# Reports Low Stock Specification

## Purpose

Admin-only report listing products where stock is at or below minimum levels. Provides visibility into inventory that needs replenishment.

## Requirements

### Requirement: Low Stock Report Access

The system SHALL restrict access to `/reports/low-stock` to ADMIN users only. OPERATOR users navigating to this route SHALL be redirected to `/dashboard`.

#### Scenario: Admin accesses report

- GIVEN the user is authenticated as ADMIN
- WHEN the user navigates to `/reports/low-stock`
- THEN the report page renders

#### Scenario: Operator blocked from report

- GIVEN the user is authenticated as OPERATOR
- WHEN the user navigates to `/reports/low-stock`
- THEN the system redirects to `/dashboard`

### Requirement: Low Stock Report Table

The system SHALL display a table of low-stock products fetched from `GET /api/reports/low-stock` with columns: Name, SKU, Stock, Min Stock, Difference (minStock - stock), Category.

#### Scenario: Report loads products

- GIVEN the user is ADMIN
- WHEN the report page loads
- THEN the system calls `GET /api/reports/low-stock`
- AND displays a table with low-stock products

#### Scenario: Empty report

- GIVEN the user is ADMIN
- WHEN all products have stock above minimum
- THEN the report displays an empty state ("No low-stock products")

### Requirement: Stock Severity Indicators

The system SHALL visually distinguish severity: products with `stock === 0` SHALL show a red/critical indicator; products with `0 < stock <= minStock` SHALL show an orange/warning indicator.

#### Scenario: Critical — zero stock

- GIVEN a product has `stock: 0`
- WHEN the report row renders
- THEN the stock cell has a red/critical indicator

#### Scenario: Warning — below minimum

- GIVEN a product has `stock: 3` and `minStock: 10`
- WHEN the report row renders
- THEN the stock cell has an orange/warning indicator

### Requirement: Link to Product Detail

The system SHALL provide a link/button on each row to navigate to the product detail page (or product edit in future changes) so the admin can update stock.

#### Scenario: Navigate to product from report

- GIVEN the admin is viewing the low-stock report
- WHEN the admin clicks the action link on a product row
- THEN the system navigates to `/products` (or `/products/:id/edit` when available)

### Requirement: Loading and Error States

The system SHALL display a loading skeleton while the report is fetching. On API error, the system SHALL display an error message.

#### Scenario: Loading state

- GIVEN the report data is being fetched
- WHEN data has not arrived
- THEN a skeleton placeholder is shown

#### Scenario: Fetch error

- GIVEN the API call fails
- WHEN the error is received
- THEN an error message is displayed

## Dependencies

- Auth capability (admin role check via route guard)
- API Client capability
- TanStack Query for data fetching

## Acceptance Criteria

- [ ] Route `/reports/low-stock` is restricted to ADMIN role
- [ ] OPERATOR users are redirected to `/dashboard`
- [ ] Report table shows Name, SKU, Stock, Min Stock, Difference, Category
- [ ] Zero-stock products have red/critical indicator
- [ ] Below-minimum products have orange/warning indicator
- [ ] Each row has a link to navigate to the product
- [ ] Loading skeleton shown during fetch
- [ ] Error state shown on API failure
- [ ] Empty state shown when no low-stock products exist

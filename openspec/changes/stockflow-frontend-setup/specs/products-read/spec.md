# Products Read Specification

## Purpose

Product list view with search, category filter, and low-stock indicators. Read-only — create/edit/delete are out of scope for this change.

## Requirements

### Requirement: Product List Table

The system SHALL display a table of products at `/products` with columns: Name, SKU, Stock, Min Stock, Price, Category. The list SHALL be fetched from `GET /api/products`.

#### Scenario: Products load successfully

- GIVEN the user is authenticated
- WHEN the user navigates to `/products`
- THEN the system calls `GET /api/products`
- AND displays a table with product rows

#### Scenario: Empty product list

- GIVEN the user is authenticated
- WHEN the API returns zero products
- THEN the system displays an empty state message (e.g., "No products found")

### Requirement: Product Search

The system SHALL provide a text search input that filters products by name or SKU. Search SHALL debounce requests and call `GET /api/products?search={text}`.

#### Scenario: Search filters products

- GIVEN the user is on `/products`
- WHEN the user types "WIDGET" in the search input
- THEN the system calls `GET /api/products?search=WIDGET`
- AND displays only matching products

### Requirement: Category Filter

The system SHALL provide a category filter dropdown. Selecting a category SHALL call `GET /api/products?categoryId={uuid}`. Category options SHALL be derived from the product data or hardcoded categories.

#### Scenario: Filter by category

- GIVEN the user is on `/products`
- WHEN the user selects "Electronics" from the category filter
- THEN the system calls `GET /api/products?categoryId={electronics-uuid}`
- AND displays only products in that category

### Requirement: Low Stock Indicator

The system SHALL visually highlight products where `stock <= minStock`. Products with `stock === 0` SHALL receive a more severe indicator (e.g., red background) than products merely below minimum (e.g., yellow).

#### Scenario: Product at zero stock

- GIVEN a product has `stock: 0` and `minStock: 10`
- WHEN the product row renders
- THEN the stock cell has a red/severe visual indicator

#### Scenario: Product below minimum stock

- GIVEN a product has `stock: 5` and `minStock: 10`
- WHEN the product row renders
- THEN the stock cell has a yellow/warning visual indicator

### Requirement: Loading and Error States

The system SHALL display a loading skeleton while the product list is fetching. On API error, the system SHALL display an error message.

#### Scenario: Loading state

- GIVEN the product list is being fetched
- WHEN the data has not yet arrived
- THEN a skeleton placeholder is shown in place of the table

#### Scenario: Fetch error

- GIVEN the API call fails
- WHEN the error is received
- THEN an error message is displayed

## Dependencies

- API Client capability
- TanStack Query for data fetching and caching
- Auth capability (for token)

## Acceptance Criteria

- [ ] Product table renders at `/products` with correct columns
- [ ] Text search debounces and calls API with `search` param
- [ ] Category filter calls API with `categoryId` param
- [ ] Products with `stock <= minStock` have visual indicators
- [ ] Products with `stock === 0` have a distinct severe indicator
- [ ] Loading skeleton shown during fetch
- [ ] Error state shown on API failure
- [ ] Empty state shown when no products exist

# Orders Read Specification

## Purpose

Order list view with status filter and order detail view. Read-only — order creation and status changes are out of scope for this change.

## Requirements

### Requirement: Order List Table

The system SHALL display a table of orders at `/orders` with columns: ID (abbreviated), Operator, Date, Status, Total Items. ADMIN users SHALL see all orders; OPERATOR users SHALL see only their own. The list SHALL be fetched from `GET /api/orders`.

#### Scenario: Admin loads all orders

- GIVEN the user is authenticated as ADMIN
- WHEN the user navigates to `/orders`
- THEN the system calls `GET /api/orders`
- AND displays all orders in the system

#### Scenario: Operator loads own orders

- GIVEN the user is authenticated as OPERATOR
- WHEN the user navigates to `/orders`
- THEN the system calls `GET /api/orders`
- AND displays only orders where `operatorId` matches the current user

### Requirement: Order Status Filter

The system SHALL provide a status filter (tabs or dropdown) with options: All, PENDING, DISPATCHED, CANCELLED. Selecting a status SHALL call `GET /api/orders?status={status}`.

#### Scenario: Filter by PENDING status

- GIVEN the user is on `/orders`
- WHEN the user selects the PENDING filter
- THEN the system calls `GET /api/orders?status=PENDING`
- AND displays only pending orders

### Requirement: Order Status Badges

The system SHALL render status badges with distinct colors: PENDING → yellow, DISPATCHED → green, CANCELLED → red.

#### Scenario: Pending order badge

- GIVEN an order has status `PENDING`
- WHEN the order row renders
- THEN the status badge is yellow

#### Scenario: Dispatched order badge

- GIVEN an order has status `DISPATCHED`
- WHEN the order row renders
- THEN the status badge is green

#### Scenario: Cancelled order badge

- GIVEN an order has status `CANCELLED`
- WHEN the order row renders
- THEN the status badge is red

### Requirement: Order Detail View

The system SHALL display order detail at `/orders/:id` with: order ID, operator email, creation date, status, and a table of order items (product name, SKU, quantity, price at order). Fetched from `GET /api/orders/:id`.

#### Scenario: View order detail

- GIVEN the user clicks an order row
- WHEN the user navigates to `/orders/:id`
- THEN the system calls `GET /api/orders/:id`
- AND displays order metadata and items table

#### Scenario: Order not found

- GIVEN the user navigates to a non-existent order
- WHEN the API returns 404
- THEN the system displays a "not found" message

### Requirement: Loading and Error States

The system SHALL display loading skeletons while order data is fetching. On API error, the system SHALL display an error message.

#### Scenario: Loading state

- GIVEN the order list or detail is being fetched
- WHEN data has not arrived
- THEN skeleton placeholders are shown

#### Scenario: Fetch error

- GIVEN the API call fails
- WHEN the error is received
- THEN an error message is displayed

## Dependencies

- API Client capability
- TanStack Query for data fetching
- Auth capability (for token and user role)

## Acceptance Criteria

- [ ] Order table renders at `/orders` with correct columns
- [ ] ADMIN sees all orders; OPERATOR sees only own orders
- [ ] Status filter calls API with `status` param
- [ ] Status badges use correct colors (yellow/green/red)
- [ ] Order detail renders at `/orders/:id` with items table
- [ ] 404 shown for non-existent orders
- [ ] Loading skeletons during fetch
- [ ] Error state on API failure

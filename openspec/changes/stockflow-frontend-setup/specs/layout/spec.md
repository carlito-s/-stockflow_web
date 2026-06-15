# Layout Specification

## Purpose

App shell with sidebar navigation, header with user info and logout, and responsive behavior for the StockFlow Web SPA.

## Requirements

### Requirement: AppShell

The system SHALL render an `AppShell` component that wraps authenticated pages. It SHALL contain a `Sidebar` on the left and a `Header` at the top, with main content in the remaining area.

#### Scenario: Authenticated user sees app shell

- GIVEN the user is authenticated
- WHEN the user navigates to any protected route
- THEN the AppShell renders with Sidebar, Header, and content area

### Requirement: Sidebar Navigation

The system SHALL render a `Sidebar` with navigation links appropriate to the user's role. ADMIN users SHALL see: Dashboard, Products, Orders, Low Stock Report. OPERATOR users SHALL see: Dashboard, Products, Orders.

#### Scenario: ADMIN sidebar links

- GIVEN the user is authenticated as ADMIN
- WHEN the Sidebar renders
- THEN the following links are visible: Dashboard, Products, Orders, Low Stock Report

#### Scenario: OPERATOR sidebar links

- GIVEN the user is authenticated as OPERATOR
- WHEN the Sidebar renders
- THEN the following links are visible: Dashboard, Products, Orders
- AND the Low Stock Report link is NOT visible

#### Scenario: Active route highlighting

- GIVEN the user is on `/products`
- WHEN the Sidebar renders
- THEN the Products link is visually highlighted as active

### Requirement: Header

The system SHALL render a `Header` showing the logged-in user's email and role, and a logout button.

#### Scenario: Header displays user info

- GIVEN the user is authenticated with email `admin@stock.com` and role `ADMIN`
- WHEN the Header renders
- THEN it displays `admin@stock.com` and `ADMIN`

#### Scenario: Logout from header

- GIVEN the user is on any page
- WHEN the user clicks the logout button in the Header
- THEN the token is cleared
- AND the user is redirected to `/login`

### Requirement: Responsive Layout

The system SHALL support desktop (≥1024px) and tablet (≥768px) viewports. On tablet, the Sidebar SHALL collapse to an icon-only mode.

#### Scenario: Tablet viewport collapses sidebar

- GIVEN the viewport width is between 768px and 1023px
- WHEN the AppShell renders
- THEN the Sidebar shows only icons without labels

#### Scenario: Mobile viewport hides sidebar

- GIVEN the viewport width is below 768px
- WHEN the AppShell renders
- THEN the Sidebar is hidden by default
- AND a hamburger toggle is available to show/hide it

## Dependencies

- Auth capability (user info, logout action)
- Zustand UI store (sidebar open/closed state)

## Acceptance Criteria

- [ ] AppShell wraps all authenticated routes
- [ ] Sidebar shows role-appropriate navigation links
- [ ] Active route is visually highlighted in sidebar
- [ ] Header shows user email and role
- [ ] Logout button in Header clears token and redirects
- [ ] Sidebar collapses to icons on tablet viewport
- [ ] Sidebar hides on mobile with toggle available

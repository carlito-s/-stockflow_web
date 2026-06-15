# Auth Specification

## Purpose

JWT authentication flow — login, register, token persistence in sessionStorage, route guards, and role-based access control for the StockFlow Web SPA.

## Requirements

### Requirement: Login

The system SHALL provide a login form at `/login` with email and password fields. On successful authentication, the system SHALL store the JWT token and user object (id, email, role) in a Zustand store persisted to sessionStorage, then redirect to `/dashboard`.

#### Scenario: Successful login

- GIVEN the user is on `/login`
- WHEN the user submits valid email and password
- THEN the system calls `POST /api/auth/login` with `{ email, password }`
- AND stores `token` and `user` in sessionStorage via Zustand persist
- AND redirects to `/dashboard`

#### Scenario: Invalid credentials

- GIVEN the user is on `/login`
- WHEN the user submits invalid credentials
- THEN the system displays an error message from the API response
- AND the user remains on `/login`

#### Scenario: Already authenticated user visits login

- GIVEN the user has a valid token in sessionStorage
- WHEN the user navigates to `/login`
- THEN the system redirects to `/dashboard`

### Requirement: Registration

The system SHALL provide a registration form at `/register` with email, password, and confirm-password fields. On success, the system SHALL redirect to `/login`.

#### Scenario: Successful registration

- GIVEN the user is on `/register`
- WHEN the user submits valid email and matching passwords
- THEN the system calls `POST /api/auth/register` with `{ email, password }`
- AND redirects to `/login` with a success indication

#### Scenario: Password mismatch

- GIVEN the user is on `/register`
- WHEN the user submits non-matching passwords
- THEN the system displays a validation error before sending the request

#### Scenario: Duplicate email

- GIVEN the user is on `/register`
- WHEN the user submits an email that already exists
- THEN the system displays the API error message (400)

### Requirement: Token Persistence

The system SHALL persist the JWT token and user object in sessionStorage via Zustand's persist middleware. Token SHALL be cleared on logout or when the API returns 401.

#### Scenario: Token survives page refresh

- GIVEN the user is authenticated
- WHEN the page is refreshed
- THEN the token and user remain available from sessionStorage
- AND the user stays authenticated

#### Scenario: Logout clears token

- GIVEN the user is authenticated
- WHEN the user clicks logout
- THEN the token and user are cleared from sessionStorage
- AND the user is redirected to `/login`

### Requirement: Route Guards

The system SHALL enforce three guard types: `RequireAuth` (redirects unauthenticated to `/login`), `RequireRole` (redirects unauthorized to `/dashboard`), and `GuestOnly` (redirects authenticated users to `/dashboard`).

#### Scenario: Unauthenticated user accesses protected route

- GIVEN the user is not authenticated
- WHEN the user navigates to `/dashboard`, `/products`, or `/orders`
- THEN the system redirects to `/login`

#### Scenario: OPERATOR accesses admin-only route

- GIVEN the user is authenticated as OPERATOR
- WHEN the user navigates to `/reports/low-stock`
- THEN the system redirects to `/dashboard`

#### Scenario: Guest-only route with authenticated user

- GIVEN the user is authenticated
- WHEN the user navigates to `/login` or `/register`
- THEN the system redirects to `/dashboard`

### Requirement: 401 Interceptor

The system SHALL intercept 401 responses from the API, clear the stored token, and redirect to `/login`.

#### Scenario: API returns 401

- GIVEN the user has a stored token
- WHEN any API request returns 401
- THEN the token is cleared from sessionStorage
- AND the user is redirected to `/login`

## Dependencies

- Zustand v5 with persist middleware
- React Router v7 route configuration
- Axios instance (api-client capability)

## Acceptance Criteria

- [ ] Login form renders at `/login` with email + password fields
- [ ] Register form renders at `/register` with email + password + confirm fields
- [ ] Successful login stores token in sessionStorage and redirects to `/dashboard`
- [ ] Invalid credentials show error, user stays on `/login`
- [ ] Logout clears token and redirects to `/login`
- [ ] Page refresh preserves authentication state
- [ ] Unauthenticated users cannot access `/dashboard`, `/products`, `/orders`
- [ ] OPERATOR cannot access `/reports/low-stock`
- [ ] 401 from API clears token and redirects to `/login`

# API Client Specification

## Purpose

Axios instance with request/response interceptors, typed response wrappers, and centralized error handling for the StockFlow Web SPA consuming the StockFlow REST API.

## Requirements

### Requirement: Axios Instance

The system SHALL create a single Axios instance configured with `VITE_API_URL` as `baseURL` and `Content-Type: application/json`.

#### Scenario: Instance configured correctly

- GIVEN the app starts
- WHEN the Axios instance is created
- THEN `baseURL` equals the value of `VITE_API_URL` (default: `http://localhost:3000`)
- AND `Content-Type` header is `application/json`

### Requirement: Request Interceptor

The system SHALL attach `Authorization: Bearer <token>` to every outgoing request when a token exists in the Zustand auth store.

#### Scenario: Authenticated request includes token

- GIVEN the user has a token in sessionStorage
- WHEN any API request is made
- THEN the request includes `Authorization: Bearer <token>`

#### Scenario: Unauthenticated request omits token

- GIVEN no token exists in sessionStorage
- WHEN any API request is made
- THEN the `Authorization` header is not set

### Requirement: Response Error Normalization

The system SHALL normalize all API errors into a consistent `{ message: string, errors?: FieldError[] }` shape. HTTP errors SHALL be mapped as follows: 400 → validation errors from `errors` array, 401 → "Session expired", 403 → "Access denied", 404 → "Resource not found", 409 → "Conflict", 500 → "Server error".

#### Scenario: Validation error response

- GIVEN the API returns 400 with `{ status: "error", message: "Error de validación", errors: [...] }`
- WHEN the error is normalized
- THEN the normalized error contains `message` and `errors` array with field-level messages

#### Scenario: Generic error response

- GIVEN the API returns 500 with `{ status: "error", message: "Internal error" }`
- WHEN the error is normalized
- THEN the normalized error contains `message: "Server error"`

### Requirement: Typed Response Wrappers

The system SHALL export TypeScript types for all API response shapes matching `doc/API_CONTRACT.md`: `LoginResponse`, `RegisterResponse`, `ProductsResponse`, `ProductDetailResponse`, `OrdersResponse`, `OrderDetailResponse`, `LowStockResponse`, `ApiResponse<T>`.

#### Scenario: Types compile without errors

- GIVEN the TypeScript project is configured
- WHEN `bun run build` executes
- THEN all API response types are valid TypeScript

### Requirement: Environment Configuration

The system SHALL read `VITE_API_URL` from environment variables with a default of `http://localhost:3000`. An `.env.example` file SHALL document the variable.

#### Scenario: Default API URL

- GIVEN no `.env` file exists
- WHEN the Axios instance is created
- THEN `baseURL` defaults to `http://localhost:3000`

## Dependencies

- Zustand auth store (for token retrieval)
- Vite environment variables

## Acceptance Criteria

- [ ] Single Axios instance with `VITE_API_URL` as baseURL
- [ ] Request interceptor attaches Bearer token from auth store
- [ ] 401 responses trigger token clear and redirect to `/login`
- [ ] Error normalization produces consistent `{ message, errors? }` shape
- [ ] TypeScript types match all API contract response shapes
- [ ] `.env.example` documents `VITE_API_URL`

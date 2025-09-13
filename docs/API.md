# QA Collaboration Platform API Documentation

## Base URL
```
http://localhost:3001/api/v1
```

## Authentication
All API endpoints (except login/register) require JWT authentication.

Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "qa_engineer"
  }
}
```

### Test Cases

#### GET /test_cases
Get all test cases with pagination.

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page (default: 20)
- `folder_id` (optional): Filter by folder
- `status` (optional): Filter by status

**Response:**
```json
{
  "test_cases": [...],
  "meta": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 100,
    "per_page": 20
  }
}
```

#### POST /test_cases
Create a new test case.

**Request:**
```json
{
  "test_case": {
    "title": "Test Login Flow",
    "description": "Test user login functionality",
    "preconditions": "User account exists",
    "steps": ["Step 1", "Step 2", "Step 3"],
    "expected_results": "User should be logged in",
    "priority": 1,
    "status": "active",
    "assigned_user_id": 2,
    "folder_id": 1
  }
}
```

### Dashboard

#### GET /dashboard/metrics
Get dashboard metrics.

**Response:**
```json
{
  "total_test_cases": 150,
  "active_test_cases": 120,
  "pass_rate": 85.5,
  "open_tickets": 25,
  "recent_runs": 45,
  "automation_coverage": 75.0
}
```
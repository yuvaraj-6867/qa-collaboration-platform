# QA Platform - Backend API

A Ruby on Rails API for managing test cases, tickets, and QA workflows.

## Setup

### Prerequisites
* Ruby 3.3.0
* Rails 8.0.2.1
* SQLite3

### Installation

1. Install dependencies:
   ```bash
   bundle install
   ```

2. Setup database:
   ```bash
   rails db:create db:migrate db:seed
   ```

3. Start the server:
   ```bash
   rails server -p 3001
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/dev_token` - Get development token (dev only)

### Dashboard
- `GET /api/v1/dashboard/metrics` - Get dashboard metrics
- `GET /api/v1/dashboard/recent_activity` - Get recent activity
- `GET /api/v1/dashboard/trends` - Get trend data

### Test Cases
- `GET /api/v1/test_cases` - List test cases
- `POST /api/v1/test_cases` - Create test case
- `GET /api/v1/test_cases/:id` - Get test case
- `PATCH /api/v1/test_cases/:id` - Update test case
- `DELETE /api/v1/test_cases/:id` - Delete test case

### Tickets
- `GET /api/v1/tickets` - List tickets
- `POST /api/v1/tickets` - Create ticket
- `GET /api/v1/tickets/:id` - Get ticket
- `PATCH /api/v1/tickets/:id` - Update ticket
- `DELETE /api/v1/tickets/:id` - Delete ticket

### Users
- `GET /api/v1/users` - List users
- `GET /api/v1/users/:id` - Get user
- `POST /api/v1/users` - Create user
- `PATCH /api/v1/users/:id` - Update user

## Testing the API

1. Get a development token:
   ```bash
   curl -X GET http://localhost:3001/api/v1/auth/dev_token
   ```

2. Use the token in subsequent requests:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/v1/test_cases
   ```

## Sample Data

The seed file creates:
- 4 users (admin, qa_manager, qa_engineer, developer)
- 2 test cases
- 4 tickets
- 4 labels
- 2 test runs

Default login credentials:
- admin@qa-platform.com / password123
- qa.manager@qa-platform.com / password123
- qa.engineer@qa-platform.com / password123
- developer@qa-platform.com / password123

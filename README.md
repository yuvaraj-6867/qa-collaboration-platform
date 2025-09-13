# Quality Assurance & Collaboration Platform

A comprehensive, integrated workspace designed to centralize test management, automation execution, documentation, and issue tracking.

## Architecture

- **Frontend**: ShadCN UI (React + Tailwind CSS + Radix UI)
- **Backend**: Ruby on Rails (API-first architecture)
- **Database**: PostgreSQL
- **Infrastructure**: AWS (EC2, S3, CloudFront, ELB)
- **Authentication**: AWS Cognito
- **Automation**: Playwright integration

## Project Structure

```
qa-collaboration-platform/
├── frontend/          # React + ShadCN UI frontend
├── backend/           # Ruby on Rails API
├── docs/             # Documentation
├── infrastructure/   # AWS infrastructure code
└── automation/       # Playwright test scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- Ruby 3.2+
- PostgreSQL 14+
- Docker (optional)

### Development Setup

1. Clone the repository
2. Set up the backend: `cd backend && bundle install && rails db:setup`
3. Set up the frontend: `cd frontend && npm install`
4. Start development servers:
   - Backend: `cd backend && rails server`
   - Frontend: `cd frontend && npm run dev`

## Key Features

- **Test Case Management**: Comprehensive test case lifecycle management
- **Automation Integration**: Direct Playwright script execution
- **Issue Tracking**: GitHub-style ticket system
- **Document Repository**: Secure document management
- **Real-time Analytics**: Dashboard with comprehensive metrics
- **Team Collaboration**: Real-time commenting and notifications

## License

MIT License
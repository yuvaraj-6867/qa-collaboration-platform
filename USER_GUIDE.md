# QA Collaboration Platform - User Guide

## Quick Start

### 1. Setup & Run
```bash
# Backend
cd backend
bundle install
rails db:setup
rails server

# Frontend  
cd frontend
npm install
npm run dev
```

### 2. Access the App
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Core Features

### 📋 Test Case Management
- **Create**: Click "New Test Case" → Fill form → Save
- **Edit**: Click test case → Edit button → Update
- **Execute**: Mark as Pass/Fail → Add comments
- **Attach Files**: Upload screenshots, logs, documents

### 🎯 Issue Tracking  
- **Create Issue**: Issues tab → New Issue → Fill details
- **Assign**: Select assignee from dropdown
- **Track Progress**: Drag between columns (To Do → In Progress → Done)
- **Comment**: Add updates and discussions

### 📁 Document Management
- **Upload**: Documents tab → Upload button → Select files
- **Organize**: Create folders → Move files
- **Share**: Set permissions → Generate links
- **Version Control**: Auto-versioning on updates

### 🤖 Automation Integration
- **Run Tests**: Automation tab → Select suite → Execute
- **View Results**: Real-time progress → Detailed reports
- **Schedule**: Set recurring test runs
- **Playwright Scripts**: Auto-detected and executable

### 👥 Team Collaboration
- **Invite Users**: Settings → Invite → Send email
- **Notifications**: Bell icon → Real-time updates
- **Comments**: Add to test cases, issues, documents
- **Activity Feed**: Track all team activities

### 📊 Analytics Dashboard
- **Test Metrics**: Pass/fail rates, execution trends
- **Issue Analytics**: Resolution time, priority distribution  
- **Team Performance**: Individual and team statistics
- **Export Reports**: PDF, Excel formats

## Navigation

### Main Menu
- **Dashboard**: Overview and metrics
- **Test Cases**: Manage test scenarios
- **Issues**: Bug tracking and tasks
- **Documents**: File repository
- **Automation**: Test execution
- **Analytics**: Reports and insights
- **Settings**: User and project config

### Quick Actions
- **Search**: Global search bar (Ctrl+K)
- **Create**: + button → Quick create menu
- **Notifications**: Bell icon → Recent updates
- **Profile**: Avatar → Settings and logout

## Tips
- Use keyboard shortcuts for faster navigation
- Set up email notifications for important updates
- Organize test cases with tags and categories
- Link issues to test cases for traceability
- Regular backups via export features
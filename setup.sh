#!/bin/bash

echo "🚀 Setting up QA Platform..."

# Backend setup
echo "📦 Setting up Rails backend..."
cd backend

# Install gems
bundle install

# Setup database
echo "🗄️ Setting up database..."
rails db:create
rails db:migrate
rails db:seed

echo "✅ Backend setup complete!"

# Frontend setup
echo "📦 Setting up React frontend..."
cd ../frontend

# Install dependencies
npm install

echo "✅ Frontend setup complete!"

cd ..

echo "🎉 Setup complete! To start the application:"
echo ""
echo "Backend (Rails API):"
echo "  cd backend && rails server -p 3001"
echo ""
echo "Frontend (React):"
echo "  cd frontend && npm run dev"
echo ""
echo "The application will be available at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:3001"
echo ""
echo "Default login credentials:"
echo "  Admin: admin@qaplatform.com / password123"
echo "  QA Manager: manager@qaplatform.com / password123"
echo "  QA Engineer: engineer@qaplatform.com / password123"
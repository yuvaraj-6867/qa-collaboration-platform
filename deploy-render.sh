#!/bin/bash

echo "🚀 Deploying QA Platform to Render..."

# Check if git is clean
if [[ -n $(git status --porcelain) ]]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "Fix Render deployment configuration - $(date)"
else
    echo "✅ Git is clean"
fi

# Push to main branch
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Deployment configuration pushed!"
echo ""
echo "🔗 Next steps:"
echo "1. Go to https://render.com/dashboard"
echo "2. Click 'New' → 'Blueprint'"
echo "3. Connect your GitHub repository"
echo "4. Select this repository"
echo "5. Click 'Apply'"
echo ""
echo "📱 Your services will be available at:"
echo "   Frontend: https://qa-platform-frontend.onrender.com"
echo "   Backend:  https://qa-collaboration-platform.onrender.com"
echo ""
echo "⏱️  Deployment usually takes 5-10 minutes"
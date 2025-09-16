#!/bin/bash

# Frontend build script for deployment
echo "Building QA Collaboration Platform Frontend..."

# Install dependencies
npm install

# Build the project
npm run build

echo "Build completed successfully!"
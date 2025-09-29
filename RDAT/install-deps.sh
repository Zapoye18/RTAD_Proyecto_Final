#!/bin/bash

echo "Installing dependencies for Refugio de Animales..."

# Backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Frontend dependencies  
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "Dependencies installed successfully!"
echo "Run 'npm test' in backend/ and frontend/ directories to run tests"
#!/bin/bash

echo "🚀 Setting up Lead Generation Tool..."
echo ""

# Backend setup
echo "📦 Setting up backend..."
cd backend
npm install
mkdir -p data
cp .env.example .env
echo "✅ Backend setup complete"
echo ""

# Frontend setup
echo "📦 Setting up frontend..."
cd ../frontend
npm install
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
echo "✅ Frontend setup complete"
echo ""

cd ..
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "  Terminal 1: cd backend && npm start"
echo "  Terminal 2: cd frontend && npm start"
echo ""
echo "Frontend will be available at: http://localhost:3000"
echo "Backend API will be available at: http://localhost:5000/api"

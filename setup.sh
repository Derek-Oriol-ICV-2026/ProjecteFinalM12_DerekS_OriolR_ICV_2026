#!/bin/bash

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🛑 Liberando puertos..."
pkill -f nodemon 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 2

echo "🔧 Instalando dependencias..."
cd "$PROJECT_DIR/backend" && npm install
cd "$PROJECT_DIR/frontend" && npm install

echo "🚀 Iniciando servidores..."

cd "$PROJECT_DIR/backend"
npm run dev &

cd "$PROJECT_DIR/frontend"
npm run dev &

sleep 5
echo "✅ Backend y Frontend iniciados"
xdg-open http://localhost:5173/ 2>/dev/null || open http://localhost:5173/ 2>/dev/null
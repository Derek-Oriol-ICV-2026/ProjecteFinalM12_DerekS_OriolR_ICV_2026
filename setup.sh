#!/bin/bash

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🛑 Liberando puertos..."
pkill -f nodemon 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 2

# Cargar nvm
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

echo "🟢 Usando Node 20..."
nvm use 20

echo "🔧 Instalando dependencias..."

cd "$PROJECT_DIR/backend"

rm -rf node_modules package-lock.json
npm install

cd "$PROJECT_DIR/frontend"

rm -rf node_modules package-lock.json
npm install

echo "🚀 Iniciando servidores..."

cd "$PROJECT_DIR/backend"
npm run dev &

cd "$PROJECT_DIR/frontend"
npm run dev &

sleep 5

echo "✅ Backend y Frontend iniciados"

xdg-open http://localhost:5173/ 2>/dev/null || open http://localhost:5173/ 2>/dev/null
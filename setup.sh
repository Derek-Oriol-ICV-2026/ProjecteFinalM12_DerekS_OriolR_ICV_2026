#!/bin/bash
 
# Obtener el directorio del proyecto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
 
# Iniciar Backend
cd "$PROJECT_DIR/backend"
npm start &
 
# Iniciar Frontend
cd "$PROJECT_DIR/frontend"
npm run dev &
 
# Esperar a que se inicien los servidores
sleep 3
 
echo "✅ Backend y Frontend iniciados"
 
# Abrir navegador
xdg-open http://localhost:5173/
 

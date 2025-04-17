#!/bin/bash

set -e
set -o pipefail

REPO_URL="git@github.com:diegobnx/finance-app.git"
PROJECT_DIR="finance-app"

if [ ! -d "$PROJECT_DIR/.git" ]; then
  echo "📦 Clonando repositório..."
  git clone "$REPO_URL"
  cd "$PROJECT_DIR"
else
  cd "$PROJECT_DIR"
  echo "📥 Atualizando repositório..."
  git pull origin main
fi

# Sobe os containers
echo "🧹 Limpando containers, volumes e redes órfãs..."
docker compose down --volumes --remove-orphans

echo "🔨 Rebuildando imagens com cache limpo..."
docker compose build --no-cache

echo "🚀 Subindo containers..."
docker compose up -d

echo "✅ Deploy finalizado com sucesso!"
echo "🩺 Verificando saúde da API backend..."

sleep 3
curl -sSf http://localhost:5555/docs > /dev/null && echo "✅ API backend está online!" || echo "❌ API backend não respondeu."

#!/bin/bash

set -e

REPO_URL="https://github.com/diegobnx/finance-app.git"
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

# Garante que o .env existe
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    echo "📄 Criando .env a partir de .env.example"
    cp .env.example .env
  else
    echo "❌ Arquivo .env não encontrado e nenhum .env.example disponível."
    exit 1
  fi
fi

# Sobe os containers
echo "🐳 Buildando e subindo os containers..."
docker compose down
docker compose up -d --build

echo "✅ Deploy finalizado com sucesso!"

# Create .env.example file
echo "VITE_API_URL=http://localhost:8000" > .env.example
echo "MONGO_URI=mongodb://mongo:27017" >> .env.example
echo "DATABASE_NAME=financeapp" >> .env.example

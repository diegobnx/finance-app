FROM python:3.11-slim

# Diretório de trabalho
WORKDIR /app

# Copia o código do backend
COPY . /app

# Instala dependências
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Expõe a porta padrão da FastAPI
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

FROM python:3.11-slim

WORKDIR /app

COPY ./requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

ENV PYTHONPATH=/app

CMD ["uvicorn", "--app-dir", "backend", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

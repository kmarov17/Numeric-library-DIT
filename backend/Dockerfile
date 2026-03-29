FROM python:3.12-alpine

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_PROGRESS_BAR=off

COPY requirements.txt .

RUN python -m pip install --upgrade pip && pip install -r requirements.txt

COPY . .

EXPOSE 8000

# CMD ["uvicorn", "app.api:app", "--host", "0.0.0.0", "--port", "8000"]
# # ...existing code...
# CMD ["sh", "-c", "alembic upgrade head && python init_admin.py && exec uvicorn app.api:app --host 0.0.0.0 --port 8000"]

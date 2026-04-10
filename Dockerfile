# Start with Python base for the backend
FROM python:3.11-slim as backend

# Install Node.js for the frontend build
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Install Backend Dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt
RUN playwright install --with-deps chromium

# 2. Install Frontend Dependencies and Build
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

COPY frontend ./frontend
RUN cd frontend && npm run build

# 3. Copy Backend Code
COPY backend ./backend

# 4. Copy Entrypoint
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000
ENV FRONTEND_PORT=3000

EXPOSE 3000 8000

ENTRYPOINT ["./entrypoint.sh"]

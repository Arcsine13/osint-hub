FROM python:3.11-slim AS python-builder

# Install sherlock in a virtual env
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir sherlock-project

FROM node:18-slim

# Copy Python venv from builder
COPY --from=python-builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Verify sherlock works
RUN sherlock --version

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

COPY backend/ ./backend/

# Create data directory
RUN mkdir -p /app/backend/data

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "backend/src/server.js"]

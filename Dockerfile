FROM node:18-slim

# Install Python and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install Sherlock
RUN pip3 install sherlock-project

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

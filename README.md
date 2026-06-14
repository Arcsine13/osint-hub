# OSINT Hub - Cyber Intelligence Platform

A modern, sleek web application that wraps and extends the Sherlock OSINT tool with a professional cyberpunk-themed interface and advanced capabilities.

![OSINT Hub](https://img.shields.io/badge/Version-1.0.0-00D4FF?style=for-the-badge&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-9D00FF?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-39FF14?style=for-the-badge)

## Live Demo

- **Frontend**: [https://osint-hub-frontend.vercel.app](https://osint-hub-frontend.vercel.app)
- **Backend API**: [https://sherlock-osint-backend.onrender.com](https://sherlock-osint-backend.onrender.com)

## Features

### Core Capabilities
- **Username Search** - Search across 25+ social media platforms using Sherlock
- **Email Lookup** - Find accounts and public records associated with email addresses
- **Phone Number Search** - Discover accounts linked to phone numbers
- **Reverse Image Search** - Find image matches across the web using Google, TinEye, and Yandex

### Advanced Features
- Real-time WebSocket progress updates
- Cyberpunk-themed dark UI with neon accents
- Advanced filtering and sorting options
- Export results as JSON or CSV
- Rate limiting and abuse prevention
- Comprehensive audit logging

## Tech Stack

### Backend
- **Runtime**: Node.js with Express
- **Real-time**: Socket.io for WebSocket connections
- **Database**: SQLite (via sql.js - WebAssembly) for caching
- **OSINT Engine**: Sherlock Python tool
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **Animations**: Framer Motion
- **Icons**: React Icons
- **State Management**: React Hooks

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Sherlock OSINT tool (`pip install sherlock-project`)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/osint-hub.git
cd osint-hub
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Install Sherlock

```bash
pip install sherlock-project
```

### 5. Configure Environment

```bash
cd backend
cp .env.example .env
# Edit .env with your API keys (optional)
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Production Build

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/` and can be served by any static file server.

## API Endpoints

### Search Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/search/username` | Search for usernames |
| POST | `/api/search/email` | Email reverse lookup |
| POST | `/api/search/phone` | Phone number lookup |
| POST | `/api/search/image` | Reverse image search |
| GET | `/api/search/status/:id` | Get search status |

### Results Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/results` | List recent searches |
| GET | `/api/results/:id` | Get search results |
| DELETE | `/api/results/:id` | Delete search |
| GET | `/api/results/:id/export/csv` | Export as CSV |
| GET | `/api/results/:id/export/json` | Export as JSON |

## Configuration

### API Keys (Optional)

Add your API keys to `backend/.env` for enhanced functionality:

```env
# For Google Reverse Image Search
SERPAPI_KEY=your_serpapi_key

# For TinEye Integration
TINEYE_API_KEY=your_tineye_key

# For Public Records (PeopleDataLabs)
PEOPLEDATALABS_KEY=your_pdl_key
```

### Rate Limiting

Default: 10 searches per hour per IP. Configure in `.env`:

```env
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW_MS=3600000
```

## Project Structure

```
osint-hub/
├── backend/
│   ├── src/
│   │   ├── server.js           # Express server setup
│   │   ├── routes/
│   │   │   ├── search.js       # Search API routes
│   │   │   └── results.js      # Results API routes
│   │   ├── services/
│   │   │   ├── sherlockService.js    # Sherlock wrapper
│   │   │   ├── imageSearchService.js # Image search
│   │   │   └── publicRecordsService.js # Public records
│   │   ├── middleware/
│   │   │   └── rateLimiter.js  # Rate limiting
│   │   └── utils/
│   │       └── database.js     # SQLite setup
│   ├── data/                   # Database storage
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── SearchTabs.jsx
│   │   │   ├── ResultsDashboard.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── LoadingOverlay.jsx
│   │   │   ├── Disclaimers.jsx
│   │   │   └── search/
│   │   │       ├── UsernameSearch.jsx
│   │   │       ├── EmailSearch.jsx
│   │   │       ├── PhoneSearch.jsx
│   │   │       └── ImageSearch.jsx
│   │   ├── hooks/
│   │   │   ├── useSocket.jsx
│   │   │   └── useSearch.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   │   └── favicon.svg
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Security & Ethics

### Important Disclaimers

⚠️ **This tool is for authorized security research only.**

- All searches are logged with timestamps and IP addresses
- Rate limiting prevents abuse (10 searches/hour default)
- Users must accept Terms of Service before use
- Data is automatically deleted after 30 days

### Responsible Use

1. Obtain proper authorization before investigating any target
2. Comply with all applicable laws and regulations
3. Do not use for harassment, stalking, or illegal purposes
4. Report any vulnerabilities through responsible disclosure

## Deployment

### GitHub Pages (Frontend)

```bash
cd frontend
npm run build
# Deploy dist/ folder to GitHub Pages
```

### Backend Hosting

Recommended platforms:
- **Railway**: Easy Node.js deployment
- **Render**: Free tier available
- **DigitalOcean**: Full control
- **Heroku**: Simple deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com
DB_PATH=/data/osint-hub.db
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Sherlock](https://github.com/sherlock-project/sherlock) - The core OSINT tool
- [React](https://reactjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations

## Support

For support, email security@osint-hub.example.com or open an issue on GitHub.

---

**⚠️ Remember: With great power comes great responsibility. Use OSINT tools ethically and legally.**

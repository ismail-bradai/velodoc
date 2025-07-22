# Velodoc - AI Copilot for Healthcare Administration

First draft of the BETA version of Velodoc, focusing primarily on doctor-facing features, including frontend, backend, and AI functionalities developed as part of internship projects.

## 🏥 About Velodoc

Velodoc is an AI-powered copilot designed to streamline healthcare administration tasks. This repository contains the complete beta implementation with three main components:

- **Frontend**: Modern React-based web application
- **Backend**: Express.js API server with authentication
- **AI Service**: Python-based AI processing module

## 📁 Project Structure

```
hello-world-velodoc/
├── README.md                    # This file
├── hw-velodoc-ai/              # AI processing service
│   └── app.py                  # Python Flask/FastAPI application
├── hw-velodoc-backend/         # Backend API server
│   ├── src/
│   │   ├── app.js             # Main Express application
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/           # Data models
│   │   ├── routes/           # API routes
│   │   └── utils/            # Utility functions
│   ├── certificates/         # SSL certificates
│   └── package.json          # Node.js dependencies
└── hw-velodoc-frontend/       # React frontend application
    ├── src/                  # Source code
    ├── public/              # Static assets
    ├── certs/              # SSL certificates
    └── package.json        # Frontend dependencies
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Python 3.8+ (for AI service)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd hw-velodoc-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the backend server:
```bash
npm start
```

The backend will run on the configured port with SSL support.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd hw-velodoc-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```
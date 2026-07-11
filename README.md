# FitBuddy

FitBuddy is a full-stack fitness companion app built as a final project. It helps users create an account, browse an exercise library, build personal workout routines, and ask an AI-powered assistant for beginner-friendly exercise suggestions.

The project uses a React frontend with a Flask REST API backend. User accounts and routines are protected with JWT authentication, while exercise and routine data are stored in SQLite through SQLAlchemy. The AI assistant uses the seeded exercise library as its knowledge base and can use Ollama/LangChain when available, with a local fallback so the feature still works without a running AI model.

## Features

- User registration and login
- JWT-protected dashboard and app pages
- Exercise library with seeded workout movements
- Personal workout routine creation, editing, and deletion
- Add and remove exercises from routines
- AI assistant for workout and exercise suggestions
- Responsive Material UI frontend
- Flask REST API with SQLAlchemy models and migrations

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Material UI
- Axios

### Backend

- Python
- Flask
- Flask-CORS
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-JWT-Extended
- SQLite

### AI

- LangChain
- LangChain Chroma
- LangChain Ollama
- Ollama
- Local keyword-based fallback recommendations

## Project Structure

```text
fitbuddy/
|-- backend/
|   |-- app.py
|   |-- ai_service.py
|   |-- config.py
|   |-- extensions.py
|   |-- requirements.txt
|   |-- seed_exercises.py
|   |-- models/
|   |-- routes/
|   `-- migrations/
|-- frontend/
|   |-- index.html
|   |-- package.json
|   |-- vite.config.js
|   `-- src/
|       |-- components/
|       |-- context/
|       |-- pages/
|       |-- services/
|       `-- theme/
`-- README.md
```

## Getting Started

### Prerequisites

Install these tools before running the project:

- Python 3.11 or newer
- Node.js and npm
- Git
- Optional: Ollama for full local AI model responses

## Backend Setup

Open a terminal from the project root.

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create the database tables and seed the exercise library:

```powershell
python seed_exercises.py
```

Start the Flask backend:

```powershell
python app.py
```

The backend runs at:

```text
http://127.0.0.1:5000
```

## Frontend Setup

Open a second terminal from the project root.

```powershell
cd frontend
npm install
npm run dev
```

The frontend usually runs at:

```text
http://localhost:5173
```

If port `5173` is already in use, Vite will automatically use another port such as `5174`.

## Build For Production

To create a production frontend build:

```powershell
cd frontend
npm run build
```

The production files will be generated in:

```text
frontend/dist
```

To preview the production build locally:

```powershell
npm run preview
```

## AI Assistant Setup

The AI assistant works in two modes:

- `local`: uses the exercise database and keyword scoring to return suggestions without an AI model.
- `ollama`: uses Ollama, LangChain, and Chroma for AI-generated answers when Ollama is running.

The app will automatically fall back to local mode if Ollama is not available.

To use Ollama mode, install Ollama and pull the recommended models:

```powershell
ollama pull llama3.2
ollama pull nomic-embed-text
```

Then start Ollama before running the Flask backend.

Optional environment variables:

```powershell
$env:OLLAMA_BASE_URL="http://localhost:11434"
$env:OLLAMA_MODEL="llama3.2"
$env:OLLAMA_EMBEDDING_MODEL="nomic-embed-text"
```

## API Overview

Base URL:

```text
http://localhost:5000/api
```

Main endpoints:

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Create a user account |
| POST | `/auth/login` | Log in and receive a JWT |
| GET | `/auth/profile` | Get current user profile |
| GET | `/exercises` | List all exercises |
| GET | `/exercises/:id` | Get one exercise |
| GET | `/routines` | List current user's routines |
| POST | `/routines` | Create a routine |
| PUT | `/routines/:id` | Rename a routine |
| DELETE | `/routines/:id` | Delete a routine |
| POST | `/routines/:id/exercise` | Add an exercise to a routine |
| DELETE | `/routines/:id/exercise/:exerciseId` | Remove an exercise from a routine |
| POST | `/ai/suggest` | Ask the AI assistant for suggestions |

Protected endpoints require an authorization header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## Environment Variables

The backend includes development defaults, but these values should be changed for deployment:

| Variable | Description | Default |
| --- | --- | --- |
| `SECRET_KEY` | Flask secret key | `fitbuddy-dev-key` |
| `JWT_SECRET_KEY` | JWT signing key | `fitbuddy-jwt-secret` |
| `DATABASE_URL` | SQLAlchemy database URL | SQLite database in `backend/fitbuddy.db` |
| `OLLAMA_BASE_URL` | Ollama server URL | `http://localhost:11434` |
| `OLLAMA_MODEL` | Chat model name | `llama3.2` |
| `OLLAMA_EMBEDDING_MODEL` | Embedding model name | `nomic-embed-text` |

## Deployment Notes

A simple deployment option is an Ubuntu server on AWS Lightsail or EC2:

1. Build the React frontend with `npm run build`.
2. Serve `frontend/dist` using Nginx.
3. Run the Flask backend with Gunicorn.
4. Proxy `/api` requests from Nginx to the Flask backend.
5. Configure production secrets using environment variables.

For a small free-tier server, use the AI assistant's local fallback mode unless the server has enough memory and CPU to run Ollama.

## Useful Commands

Run backend:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python app.py
```

Run frontend:

```powershell
cd frontend
npm run dev
```

Build frontend:

```powershell
cd frontend
npm run build
```

Check Git status:

```powershell
git status
```

## Author

Created by Huzefa as a final project for the FitBuddy fitness application.

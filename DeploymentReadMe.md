# SecondChance

SecondChance is a full-stack web application built as the capstone project for the **IBM Full Stack JavaScript Developer** professional certificate. It allows users to list, browse, and search secondhand items ("gifts") that are being given a second chance instead of being thrown away.

This repository is a **monorepo** containing both the backend API and the frontend client.

---

## Project Structure

```
second-chance/
├── .github/                   # GitHub Actions CI/CD workflows
├── secondChance-backend/      # Express.js REST API + MongoDB
│   ├── models/                # DB connection and data models
│   ├── routes/                # API route handlers (items, search, auth, etc.)
│   ├── util/                  # Shared utility functions
│   ├── public/                # Static assets served by the backend
│   ├── app.js                 # Express app entry point
│   ├── logger.js              # Request/error logging (winston/pino, etc.)
│   ├── Dockerfile             # Backend container definition
│   ├── deployment.yml         # Kubernetes Deployment + Service manifest
│   ├── .env.sample            # Template for required environment variables
│   └── package.json
└── secondChance-frontend/     # React (Create React App) client
    ├── src/
    ├── public/
    ├── Dockerfile             # Frontend container definition
    └── package.json
```

> **Note:** A third folder (`secondchancewebsite/`) currently exists alongside these two — this README covers `secondChance-backend` and `secondChance-frontend` only. If `secondchancewebsite` is meant to be part of the deployed app, it should be documented separately or merged in.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Create React App), Bootstrap |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Containerization | Docker |
| Orchestration | Kubernetes (IBM Cloud Kubernetes Service) |
| Container Registry | IBM Cloud Container Registry (`icr.io`) |
| CI/CD | GitHub Actions |

---

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18.x recommended, matching the backend Dockerfile)
- npm
- A running MongoDB instance (local or a connection string to a hosted instance)
- Docker (for containerized builds/deployment)

### 1. Clone the repository
```bash
git clone <repo-url>
cd second-chance
```

### 2. Backend setup
```bash
cd secondChance-backend
npm install
cp .env.sample .env
# edit .env with your MongoDB URI and any other required values
npm start
```
The backend runs on **http://localhost:3060** by default.

### 3. Frontend setup
```bash
cd secondChance-frontend
npm install
npm start
```
The frontend runs on **http://localhost:3000** by default and expects the backend URL to be configured in `src/config.js` (`urlConfig.backendUrl`).

---

## Running with Docker

Each service has its own `Dockerfile`.

**Backend:**
```bash
cd secondChance-backend
docker build -t secondchanceapp-backend .
docker run -p 3060:3060 --env-file .env secondchanceapp-backend
```

**Frontend:**
```bash
cd secondChance-frontend
docker build -t secondchanceapp-frontend .
docker run -p 3000:3000 secondchanceapp-frontend
```

---

## Deployment (Kubernetes / IBM Cloud)

The backend includes a `deployment.yml` Kubernetes manifest defining:
- A **Deployment** running 2 replicas of the backend container, pulled from IBM Cloud Container Registry (`icr.io`)
- A **NodePort Service** exposing the app externally on port 80, forwarding to the container's port 3060

To deploy manually:
```bash
kubectl apply -f secondChance-backend/deployment.yml
```

Images are pulled from a private registry, so a Kubernetes secret named `icr` (containing registry credentials) must exist in the target namespace beforehand.

---

## CI/CD

GitHub Actions workflows in `.github/workflows/` automate:
1. Installing dependencies and running tests on push
2. Building the Docker image for the changed service (backend and/or frontend)
3. Pushing the image to IBM Cloud Container Registry
4. Applying/updating the Kubernetes deployment

*(See `.github/workflows/` for the exact pipeline steps per service.)*

---

## Environment Variables

See `secondChance-backend/.env.sample` for the full list of required variables (e.g. MongoDB connection string, JWT secret, port).

---

## License

See `LICENSE` for details.
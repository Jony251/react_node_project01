# Learning Arcade (React + Node.js)

A full-stack educational gaming platform inspired by the **ABCya-style** concept:

- bright and playful UX
- curriculum-aligned categories
- game-driven learning

## Product Concept

The frontend now includes a game concept library with the required subjects:

1. **Math** (10 ideas)
2. **Letters / ABC Games** (10 ideas)
3. **Logic + Flags/Geography** (10 ideas)

Total included concept entries: **30**.

## Tech Stack

### Frontend (FE)
- React
- React Router
- CSS Modules + global CSS
- Axios

### Backend (BE)
- Node.js
- Express
- MySQL2
- JWT auth
- Multer for image uploads

### Database
- MySQL-compatible engine (recommended on AWS: **Aurora MySQL** or **RDS MySQL**)

---

## Local Development

### 1) Install dependencies

```bash
cd FE && npm install
cd ../BE && npm install
```

### 2) Configure backend environment

Copy the example file and edit values:

```bash
cd BE
cp .env.example .env
```

`BE/.env` example:

```env
PORT=8081
CORS_ORIGIN=http://localhost:3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=gamedatabase
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=true
```

### 3) Start services

```bash
# Terminal 1
cd BE
npm run dev

# Terminal 2
cd FE
npm start
```

Frontend runs on `http://localhost:3000`, API on `http://localhost:8081`.

---

## Docker Setup for API

The API has a dedicated Dockerfile: `BE/Dockerfile`.

### Build and run directly

```bash
docker build -t learning-arcade-api ./BE
docker run -d \
  --name learning-arcade-api \
  -p 8081:8081 \
  --env-file ./BE/.env \
  learning-arcade-api
```

### Run using docker compose

```bash
cp BE/.env.example BE/.env
docker compose -f docker-compose.api.yml up -d --build
```

---

## AWS Deployment Guide

## A) API deployment on AWS EC2 (Docker)

1. Launch EC2 instance (Ubuntu recommended).
2. Open Security Group inbound rules:
   - `22` (SSH) from your IP
   - `8081` from frontend source (or ALB only, preferred)
3. Install Docker + Compose plugin:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER
newgrp docker
```

4. Clone repository on EC2:

```bash
git clone <your-repo-url>
cd react_node_project01
```

5. Create backend env file:

```bash
cp BE/.env.example BE/.env
nano BE/.env
```

Set Aurora/RDS values (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL=true`).

6. Start API container:

```bash
docker compose -f docker-compose.api.yml up -d --build
docker compose -f docker-compose.api.yml ps
```

7. Verify API:

```bash
curl http://<EC2_PUBLIC_IP>:8081/api/games
```

> For production, put the EC2 API behind an **Application Load Balancer + HTTPS (ACM)**.

---

## B) Frontend deployment on AWS S3 (static hosting)

1. Build frontend:

```bash
cd FE
npm run build
```

2. Create S3 bucket (example: `learning-arcade-frontend-prod`).
3. Enable static website hosting in the bucket.
4. Upload `FE/build` contents to bucket root.
5. Update React API base URL in environment:

Create `FE/.env.production`:

```env
REACT_APP_API_BASE_URL=https://<your-api-domain-or-alb>
```

Rebuild and re-upload:

```bash
npm run build
aws s3 sync build/ s3://learning-arcade-frontend-prod --delete
```

6. (Recommended) Put CloudFront in front of S3 for HTTPS + CDN.

---

## C) Database on AWS Aurora / RDS

Use either:
- **Aurora MySQL** (best for scalability/performance)
- **RDS MySQL** (simpler standard setup)

Required backend env vars:

```env
DB_HOST=<aurora-or-rds-endpoint>
DB_PORT=3306
DB_USER=<db-user>
DB_PASSWORD=<db-password>
DB_NAME=gamedatabase
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
```

Security setup:
- Allow inbound MySQL (`3306`) on DB security group **only from API EC2 security group**.
- Do **not** expose DB to the public internet.

---

## Recommended Production Architecture

- **Frontend:** S3 + CloudFront
- **API:** Dockerized Node.js app on EC2 (or ECS later)
- **DB:** Aurora MySQL / RDS MySQL
- **TLS:** ACM certificates + HTTPS via CloudFront/ALB

---

## Key Project Paths

```text
FE/                         React frontend
BE/                         Node.js API
BE/Dockerfile               API container image
BE/.env.example             API environment template
docker-compose.api.yml      Run API via Docker Compose
DB/gamedatabase.sql         MySQL schema/data dump
```

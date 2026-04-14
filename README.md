# 🎮 FunZone – Educational Games for Kids

A full-stack educational gaming platform inspired by [ABCya.com](https://www.abcya.com/).  
Children can play **Math**, **Letters/ABC**, and **Logic/Geography** games in a bright, fun interface.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Local Development](#local-development)
5. [Docker – API Container](#docker--api-container)
6. [AWS Deployment Guide](#aws-deployment-guide)
   - [Architecture Overview](#architecture-overview)
   - [Step 1 – Aurora/RDS (Database)](#step-1--aurorardsrdsdatabase)
   - [Step 2 – EC2 (API Server)](#step-2--ec2-api-server)
   - [Step 3 – S3 (Frontend)](#step-3--s3-frontend)
7. [Environment Variables](#environment-variables)
8. [Game Catalogue](#game-catalogue)
9. [Authors](#authors)

---

## Project Overview

FunZone is a browser-based educational platform for kids aged 4–12.  
It features **36 interactive games** across three subjects:

| Subject | Games | Ages |
|---------|-------|------|
| 🔢 Math | 12 games | 4+ |
| 🔤 Letters & ABC | 12 games | 4+ |
| 🧩 Logic & World | 12 games | 4+ |

Users register/log in, browse games by category, and play directly in the browser – no downloads or plugins required.

---

## Features

- **Colourful, child-friendly UI** – large buttons, fun fonts, animations
- **36 built-in browser games** – all self-contained React components
- **Auth system** – JWT login/register; admin role for content management
- **Game CMS** – admins can add/edit/delete game entries via the manage-games page
- **Responsive design** – works on desktop and tablets
- **Production-ready** – Dockerised API, S3 static hosting, Aurora DB

---

## Tech Stack

### Frontend
- React 18 (Create React App)
- React Router v6
- CSS Modules + CSS custom properties
- Google Fonts (Nunito)

### Backend
- Node.js / Express 4
- MySQL2 driver
- JWT (jsonwebtoken) + bcrypt
- multer (file uploads)

### Infrastructure
- **DB**: AWS Aurora (MySQL-compatible) or RDS MySQL 8
- **API**: Docker container on AWS EC2
- **Frontend**: AWS S3 static website + optional CloudFront CDN

---

## Local Development

### Prerequisites
- Node.js 18+
- MySQL 8 running locally (or Docker)

### 1 – Clone & install

```bash
git clone https://github.com/Jony251/react_node_project01.git
cd react_node_project01
```

```bash
# Backend
cd BE
npm install

# Frontend
cd ../FE
npm install
```

### 2 – Database

Import the provided schema:

```bash
mysql -u root -p < DB/gamedatabase.sql
```

### 3 – Environment

```bash
cp .env.example .env
# Edit .env with your local DB credentials and a JWT secret
```

### 4 – Run

```bash
# Terminal 1 – API (port 8081)
cd BE && npm run dev

# Terminal 2 – React dev server (port 3000)
cd FE && npm start
```

Open **http://localhost:3000** in your browser.

---

## Docker – API Container

### Build & run locally

```bash
# From repo root
docker compose up --build
```

This starts:
- **funzone-api** on port 8081
- **funzone-db** (MySQL 8) on port 3306, auto-seeded with `DB/gamedatabase.sql`

### Build image only

```bash
cd BE
docker build -t funzone-api:latest .
```

### Environment variables for Docker

Copy `.env.example` to `.env` and set all variables before running `docker compose up`.

---

## AWS Deployment Guide

### Architecture Overview

```
Users
  │
  ▼
[CloudFront CDN]  ──optional──►  [S3 Static Site]
                                        (React build)
  │
  ▼  (API calls)
[EC2 Instance]
  └─ Docker container: funzone-api
  │
  ▼
[AWS Aurora / RDS MySQL 8]
```

---

### Step 1 – Aurora/RDS (Database)

> **Recommended**: Amazon Aurora MySQL-compatible (Serverless v2 for auto-scaling, or provisioned db.t3.medium for a fixed cost).

1. **Create a DB Subnet Group**
   - In AWS Console → RDS → Subnet groups
   - Add at least two private subnets in different AZs

2. **Create the cluster/instance**
   - Engine: Aurora MySQL 8.0 (or RDS MySQL 8.0)
   - DB identifier: `funzone-db`
   - Master username: `admin`
   - Set a strong password (save it!)
   - VPC: same VPC as your EC2 instance
   - Disable public access (keep DB private)
   - Create a **Security Group** `funzone-db-sg`:
     - Inbound: TCP 3306 from `funzone-api-sg` (EC2 security group) only

3. **Import schema**

   From inside the EC2 instance (after it is set up):
   ```bash
   mysql -h <aurora-endpoint> -u admin -p gamedatabase < DB/gamedatabase.sql
   ```

4. **Note the endpoint**
   - Writer endpoint: `funzone-db.cluster-xxxx.us-east-1.rds.amazonaws.com`

---

### Step 2 – EC2 (API Server)

1. **Launch an EC2 instance**
   - AMI: Amazon Linux 2023 or Ubuntu 22.04 LTS
   - Instance type: `t3.small` (minimum) or `t3.medium`
   - VPC: same as RDS
   - Security Group `funzone-api-sg`:
     - Inbound: TCP 22 (SSH) from your IP
     - Inbound: TCP 8081 from `0.0.0.0/0` (or behind a Load Balancer on port 80/443)
   - Attach an IAM role with `AmazonEC2ContainerRegistryReadOnly` if using ECR

2. **SSH into the instance and install Docker**

   ```bash
   # Amazon Linux 2023
   sudo dnf update -y
   sudo dnf install docker -y
   sudo systemctl enable --now docker
   sudo usermod -aG docker ec2-user
   newgrp docker

   # Install Docker Compose plugin
   sudo mkdir -p /usr/local/lib/docker/cli-plugins
   sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
     -o /usr/local/lib/docker/cli-plugins/docker-compose
   sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
   ```

3. **Copy project files to EC2**

   ```bash
   # From your local machine
   scp -r ./BE ./DB ./docker-compose.yml .env.example \
     ec2-user@<EC2-PUBLIC-IP>:~/funzone/
   ```

   Or clone the repo directly:
   ```bash
   git clone https://github.com/Jony251/react_node_project01.git ~/funzone
   ```

4. **Configure environment on EC2**

   ```bash
   cd ~/funzone
   cp .env.example .env
   nano .env
   # Set:
   #   DB_HOST=<aurora-writer-endpoint>
   #   DB_USER=admin
   #   DB_PASSWORD=<your-password>
   #   JWT_SECRET=<long-random-string>
   #   FRONTEND_URL=https://<your-s3-or-cloudfront-url>
   ```

5. **Start the API container**

   ```bash
   # API only (DB is Aurora, not local Docker)
   docker compose up -d api
   ```

   Or build and run manually:
   ```bash
   docker build -t funzone-api:latest ./BE
   docker run -d \
     --name funzone-api \
     --restart unless-stopped \
     -p 8081:8081 \
     --env-file .env \
     funzone-api:latest
   ```

6. **Verify**

   ```bash
   curl http://localhost:8081/health
   # Expected: {"status":"ok"}
   ```

7. **Optional – NGINX reverse proxy (HTTP→HTTPS)**

   ```bash
   sudo dnf install nginx -y
   ```

   `/etc/nginx/conf.d/funzone.conf`:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:8081;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

   Then add an HTTPS certificate with Certbot:
   ```bash
   sudo dnf install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d api.yourdomain.com
   ```

---

### Step 3 – S3 (Frontend)

1. **Build the React app**

   ```bash
   cd FE
   # Set API URL if not using a proxy
   REACT_APP_API_URL=https://api.yourdomain.com npm run build
   ```

2. **Create an S3 bucket**

   - Bucket name: `funzone-app` (must be globally unique)
   - Region: same as EC2/RDS
   - **Uncheck** "Block all public access"
   - Enable **Static website hosting**:
     - Index document: `index.html`
     - Error document: `index.html` (for client-side routing)

3. **Set bucket policy for public read**

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::funzone-app/*"
       }
     ]
   }
   ```

4. **Upload the build**

   ```bash
   aws s3 sync FE/build/ s3://funzone-app --delete
   ```

   Your site URL: `http://funzone-app.s3-website-us-east-1.amazonaws.com`

5. **Optional – CloudFront CDN (HTTPS + custom domain)**

   - Create a CloudFront distribution
   - Origin: your S3 website endpoint
   - Redirect HTTP → HTTPS
   - Custom error response: 404 → `/index.html` (status 200) for SPA routing
   - Attach an ACM certificate for your custom domain

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Node environment |
| `PORT` | `8081` | API listen port |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `root` | DB username |
| `DB_PASSWORD` | _(empty)_ | DB password |
| `DB_NAME` | `gamedatabase` | Database name |
| `JWT_SECRET` | _(hardcoded)_ | **Must be changed in production** |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed CORS origin |

---

## Game Catalogue

### 🔢 Math (12 games)
| Game | Min Age | Description |
|------|---------|-------------|
| Count the Stars | 4 | Count falling stars and enter the number |
| Addition Quest | 5 | MCQ addition problems up to 40 |
| Subtraction Hero | 6 | MCQ subtraction problems |
| Multiplication Rocket | 7 | Times-table MCQ |
| Number Balloons | 5 | Pop the correct answer balloon |
| Greater or Less? | 5 | Compare two numbers with <, =, > |
| Missing Number | 6 | Fill the gap in a number sequence |
| Shape Count | 4 | Count shapes among distractors |
| Even or Odd? | 6 | Classify numbers |
| Fraction Finder | 8 | Match fractions to pizza visuals |
| Tell the Time | 7 | Read an analogue clock |
| Division Dash | 8 | MCQ division problems |

### 🔤 Letters & ABC (12 games)
| Game | Min Age | Description |
|------|---------|-------------|
| ABC Order | 4 | Fill the missing letter in an alphabet sequence |
| Word Match | 5 | Match picture to word |
| Spell It! | 6 | Type the spelling for a picture |
| Missing Letter | 5 | Complete a 3-letter word |
| Upper & Lower | 4 | Match uppercase to lowercase |
| Rhyme Time | 5 | Pick the rhyming word |
| Vowel Hunt | 5 | Tap all vowels in a word |
| Word Scramble | 7 | Unscramble jumbled letters |
| First Sound | 4 | Identify the starting letter |
| Word Builder | 7 | Hangman-style word guessing |
| Sentence Builder | 8 | Arrange words into a sentence |

### 🧩 Logic & World (12 games)
| Game | Min Age | Description |
|------|---------|-------------|
| Flag Quiz | 7 | Identify country from emoji flag |
| World Capitals | 8 | Match country to capital city |
| Continent Sort | 7 | Place countries on correct continents |
| Pattern Master | 5 | Complete an emoji pattern |
| Memory Match | 4 | Flip-card matching pairs |
| Maze Runner | 5 | Navigate a procedurally generated maze |
| Color Sort | 4 | Sort items by colour group |
| What Comes Next? | 6 | Number sequence prediction |
| True or False | 6 | Geography & science fact check |
| Odd One Out | 5 | Find the item that doesn't belong |
| Country & Landmark | 8 | Match landmark to country |
| River & Country | 9 | Match river to country |

---

## Authors

- Evgeny Nemchenko
- Leonid Shmiakin

---

*Built with ❤️ for kids everywhere.*

<div align="center">

# FunZone: educational games for kids

**A full-stack web platform with 35 browser games for children: maths, letters and logic/geography. React front end, Node.js/Express API, MySQL, JWT auth with an admin game manager, Dockerised API.**

![React 18](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express%204-339933?logo=nodedotjs&logoColor=white)
![MySQL 8](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

</div>

After signing in, children pick a subject, filter games and play right in the browser, with no downloads or plugins. Every game is a self-contained React component registered in one catalogue (`FE/src/data/gamesRegistry.js`). Admins also get a protected page for managing a database-backed game catalogue (title, age rating, description, cover image) through the REST API. Built as a team project with Leonid Shmiakin; the visual style is inspired by [ABCya.com](https://www.abcya.com/).

## Highlights

- **35 games in three subjects:** Math (12), Letters & ABC (11), Logic & World (12). Includes a procedurally generated maze, an analogue-clock reader, fraction pizzas, flag and capital quizzes, and a sentence builder.
- **One shell, many games.** A single registry drives the game hub, its category filters and the "Ages N+" labels; `GameShell` looks the game up by id at `/play/:id` and hosts it, and all games share one UI style module.
- **Auth and roles.** Registration and login with bcrypt-hashed passwords and JWTs; admin-only routes are protected on both sides (`ProtectedRoute` in React, `verifyToken` + `checkAdmin` middleware in Express).
- **Game CMS.** Admins add, edit and delete game entries; cover images are uploaded with multer and stored in MySQL, then served by the API.
- **Containerised API.** `docker compose up` starts the API and a MySQL 8 database that is seeded automatically from `DB/gamedatabase.sql`, with a health check (`GET /health`).
- **Configuration from the environment.** Database settings, CORS origin and the JWT signing secret are read from environment variables; the API refuses to start without `JWT_SECRET`.

## Tech stack

**Frontend:** React 18 (Create React App) · React Router 6 · Axios · CSS Modules + CSS custom properties
**Backend:** Node.js · Express 4 · mysql2 · jsonwebtoken · bcrypt · multer · CORS
**Database:** MySQL 8 (or a MySQL-compatible AWS Aurora / RDS instance)
**Infrastructure:** Docker · Docker Compose

## Project structure

```
FE/src/
  components/
    games/             math/ (12) · letters/ (11) · logic/ (12) + shared GameUI styles
    GameHub/           catalogue with category filters
    GameShell/         game page (/play/:id): finds the game in the registry and hosts it
    GameManagement/    admin CMS: list, add, edit, delete games
    LogIn_Reg/         login and registration forms
    common/            buttons, inputs, modal, ProtectedRoute
  data/gamesRegistry.js  single source of truth for the built-in games
  context/AuthContext.jsx
BE/
  App.js               Express app, CORS, routes, /health
  routes/              games, user, pageContent
  middleware/auth.js   JWT verification and admin check
  database/            MySQL connection (singleton)
DB/gamedatabase.sql    schema and seed data
docker-compose.yml     API + MySQL 8
```

## Getting started

### Docker (API + database)

```bash
cp .env.example .env      # set JWT_SECRET (required) and the DB_* values
docker compose up --build
```

This starts the API on port 8081 and MySQL 8 on port 3306, seeded from `DB/gamedatabase.sql`. Then start the front end:

```bash
cd FE
npm install
npm start                 # http://localhost:3000, proxies /api to localhost:8081
```

### Without Docker

Requires Node.js 18+ and MySQL 8.

```bash
mysql -u root -p < DB/gamedatabase.sql

cd BE
npm install
# the API reads its settings from the process environment
# (JWT_SECRET is required; DB_HOST, DB_USER, DB_PASSWORD, DB_NAME as needed)
npm run dev               # http://localhost:8081

cd ../FE
npm install
npm start                 # http://localhost:3000
```

To give a user admin rights, set `role = 1` for that user in the `users` table.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `JWT_SECRET` | **yes** | Secret used to sign and verify JWTs; the API will not start without it |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | for non-default setups | MySQL connection |
| `FRONTEND_URL` | in production | Allowed CORS origin |
| `PORT` | no | API port (8081 by default) |
| `NODE_ENV` | no | Node environment |

See `.env.example` for the full template.

### Deployment notes

The project was prepared for AWS: the API container on EC2, the database on Aurora / RDS MySQL, and the static React build on S3 (optionally behind CloudFront). The front end calls the API with relative `/api/...` paths, so in production serve both from the same origin (for example, through a reverse proxy or CloudFront behaviours that route `/api/*` to the API).

## Game catalogue

**Math:** Count the Stars · Addition Quest · Subtraction Hero · Multiplication Rocket · Number Balloons · Greater or Less? · Missing Number · Shape Count · Even or Odd? · Fraction Finder · Tell the Time · Division Dash

**Letters & ABC:** ABC Order · Word Match · Spell It! · Missing Letter · Upper & Lower · Rhyme Time · Vowel Hunt · Word Scramble · First Sound · Word Builder · Sentence Builder

**Logic & World:** Flag Quiz · World Capitals · Continent Sort · Pattern Master · Memory Match · Maze Runner · Color Sort · What Comes Next? · True or False · Odd One Out · Country & Landmark · River & Country

## Authors

- **Evgeny Nemchenko**: [bluecat.cc](https://bluecat.cc) · [LinkedIn](https://www.linkedin.com/in/evgeny-nemchenko) · [nevgeny90@gmail.com](mailto:nevgeny90@gmail.com) · [GitHub @Jony251](https://github.com/Jony251)
- **Leonid Shmiakin**

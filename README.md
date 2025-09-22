# MovieBoard

A simple full‑stack movie suggestion and voting board. Users can sign up, suggest movies, upvote/downvote, and comment. Built as a monorepo with separate backend and frontend.

## Monorepo layout

- `be/` – Express + Mongoose API (serverless‑ready)
- `fe/` – React + Vite SPA

## Live deployment

- App (frontend + API proxy): https://mboard-taupe.vercel.app
- API base (same origin on Vercel): https://mboard-taupe.vercel.app/api

Note: In development the frontend currently calls absolute URLs to the Vercel deployment. See “Configure API base URL” to point it to your local API.

## Tech stack

- Backend: Node.js, Express 5, Mongoose (MongoDB Atlas), JSON Web Tokens, bcrypt, CORS, dotenv, serverless-http
- Frontend: React 19, Vite 7, Axios, react-router-dom, Tailwind CSS 4, lucide-react icons
- Deployment: Vercel (serverless functions for API)

## Prerequisites

- Node.js 18+ (LTS recommended)
- A MongoDB connection string (MongoDB Atlas or local)
- Vercel CLI (optional, for local serverless emulation and deploy)

## Quick start

1) Clone and install deps
- Backend: in `be/` run your package manager install
- Frontend: in `fe/` run your package manager install

2) Configure environment
- Copy `be/.env.example` to `be/.env` and set values
- Optionally copy `fe/.env.example` to `fe/.env` if you want to override the API base URL in the app code

3) Run locally
- Backend: see “Run the backend locally”
- Frontend: see “Run the frontend locally”

4) Open the app
- Frontend dev server defaults to http://localhost:5173

## Backend

Location: `be/`

Key files
- `index.js` – Express app wired for serverless (exports `serverless(app)`). Routes mounted under `/api`.
- `database/db.js` – Mongoose connection using `MONGO_URL`
- `middleware/auth.js` – Parses `Authorization: Bearer <token>`, attaches `req.user` or `null`
- `models/` – Mongoose models: `User`, `Movie`, `Comment`, `Vote`
- `routes/` – `/api/user/*` and `/api/movies/*`

Environment (`be/.env`)
- `MONGO_URL` – your MongoDB connection string
- `JWT_SECRET` – secret for signing JWTs

Run the backend locally
- The code is configured for serverless (Vercel). To run locally as a traditional server, you can:
  - Option A (recommended): use Vercel CLI in the repo root and configure an API function entry pointing to `be/index.js`.
  - Option B (quick tweak): add a tiny dev entrypoint that imports the Express app and calls `app.listen(3000)`. If you’d like, we can add this helper file.

API base URL in development
- If you run the API locally on `http://localhost:3000`, you’ll likely want the frontend to call your local API. See “Configure API base URL”.

## Frontend

Location: `fe/`

Scripts
- `dev` – Vite dev server
- `build` – production build
- `preview` – preview the production build locally

Configure API base URL
- The app currently calls absolute URLs to `https://mboard-taupe.vercel.app`. For local development, change those Axios calls to use a base URL from an env variable (e.g., `import.meta.env.VITE_API_BASE_URL`). An example file is provided at `fe/.env.example`.

## Database schema diagram

[ Add your schema diagram image here ]

You can place a diagram file at `docs/schema.png` and embed it using:

![Database schema](docs/schema.png)

### Collections and fields

- Users
  - `_id` (ObjectId)
  - `name` (String)
  - `email` (String)
  - `password_hash` (String)
  - `role` (String, default `user`)
  - `createdAt`, `updatedAt` (Date, via Mongoose timestamps)

- Movies
  - `_id` (ObjectId)
  - `title` (String)
  - `desc` (String)
  - `added_by` (ObjectId ref User)
  - timestamps

- Comments
  - `_id` (ObjectId)
  - `comment` (String, required)
  - `user_id` (ObjectId ref User, required)
  - `movie_id` (ObjectId ref Movie, required)
  - timestamps

- Votes
  - `_id` (ObjectId)
  - `user_id` (ObjectId ref User, required)
  - `movie_id` (ObjectId ref Movie, required)
  - `vote` (Number, enum [-1, 1], required)
  - Unique compound index on `{ user_id, movie_id }`
  - timestamps

## API overview

Base path: `/api`

Auth
- JWT in `Authorization: Bearer <token>` header
- Middleware allows guest requests (token optional); `req.user` is `null` when not provided/invalid

User routes (`/api/user`)
- `POST /signup` – Body: `{ name, email, password }` → Creates user
- `POST /login` – Body: `{ email, password }` → Returns `{ token, user }`
- `GET /profile` – Requires valid token → Returns current user

Movie routes (`/api/movies`)
- `GET /getAllMovies` – Token optional → Returns movies with `likes`, `dislikes`, `userVote`, `comments`
- `GET /getAllComments` – Intended to return comments for a movie; controller expects `movieId` but route has no param. Consider updating to `GET /suggestedMovie/:movieId/comments`.
- `POST /suggestMovie` – Auth required – Body: `{ title, desc }`
- `POST /suggestedMovie/:movieId/comments` – Auth required – Body: `{ comment }`
- `POST /suggestedMovie/:movieId/vote` – Auth required – Body: `{ vote }` where `vote ∈ {-1, 0, 1}`; `0` clears vote
- `GET /getUserMovies` – Auth required – Returns current user’s own movies
- `DELETE /suggestedMovie/:movieId` – Auth required – Owner or admin only

## Deployment

Vercel
- The backend exports `serverless(app)` which aligns with Vercel Serverless Functions.
- Frontend can be deployed as a static build; configure the API routes to be handled by the serverless function. The current production URL is `https://mboard-taupe.vercel.app`.

Environment variables on Vercel
- Set `MONGO_URL` and `JWT_SECRET` in your project settings.

## Notes on AI usage

- No AI models run in the application at runtime.
- Documentation (this README) was authored with assistance from GitHub Copilot.
- Code was reviewed and organized by a human; please report any inaccuracies.

## Troubleshooting

- `Connected to MongoDB` not printed: ensure `MONGO_URL` is valid and reachable.
- Local API not responding: remember that `index.js` is serverless-oriented. Use Vercel dev or add a small local entrypoint that calls `app.listen(3000)`.
- CORS issues: when running frontend and backend on different origins locally, enable appropriate CORS settings in `be/index.js`.

## License

ISC (default). Update as needed.

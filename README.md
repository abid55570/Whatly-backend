# Whatly — Backend

WhatsApp Business automation for Indian SMBs (kirana, restaurant, salon, gym,
coaching, clinic). This repo is the **backend + docs + infra**:

- **FastAPI** API (`app/`) — auth, businesses, intents/Q&A packs, inbox,
  orders, billing, GST/invoicing, WhatsApp webhooks
- **PostgreSQL** (data), **Redis** (queue/cache), **Celery** worker + beat
  (background jobs), **Flower** (job dashboard), **Adminer** (DB GUI)
- **docs/** — setup, deployment, GST, infra, dev-mode, etc.

> **Frontend lives in a separate repo:** `Whatly-frontend`
> (Next.js PWA → https://github.com/abid55570/Whatly-frontend). It talks to this
> API over `/api/*`.

---

## Run locally with Docker (recommended)

### Prerequisites
- **Docker Desktop** (Windows/Mac/Linux) — https://docker.com/desktop
- Git

### Steps
```bash
# 1. Clone
git clone https://github.com/abid55570/Whatly-backend.git
cd Whatly-backend

# 2. Environment
cp .env.example .env
#    Minimum for dev (see docs/envsetup.md for every key):
#      APP_ENV=development
#      POSTGRES_USER=postgres  POSTGRES_PASSWORD=postgres  POSTGRES_DB=whatsapp_saas
#      SECRET_KEY=<python -c "import secrets;print(secrets.token_urlsafe(64))">
#      META_WEBHOOK_VERIFY_TOKEN=local-dev-token
#      PLATFORM_WHATSAPP_PHONE_NUMBER=+919999999999

# 3. Start the stack
docker compose up -d

# 4. Create the database schema (REQUIRED — run before first use)
docker compose exec backend alembic upgrade head

# 5. (optional) Create a superuser
docker compose run --rm backend python scripts/create_superuser.py --phone "+919876543210" --name "Owner"
```

### URLs
| Service | URL |
|---|---|
| API | http://localhost:8000 |
| Swagger docs | http://localhost:8000/docs |
| Health | http://localhost:8000/health |
| Adminer (DB GUI) | http://localhost:8080 — server `postgres`, user/pass `postgres` |
| Flower (jobs) | http://localhost:5555 |

### Everyday commands
```bash
docker compose ps                      # status
docker compose logs -f backend         # API logs
docker compose exec backend pytest     # run tests
docker compose down                    # stop (keeps data)
docker compose down -v                 # stop + WIPE data (then re-run alembic upgrade head)
```

> What each container is for + when to look at it: **`docs/infra-services.md`**.

---

## Run locally WITHOUT Docker

Install Postgres + Redis + Python yourself and run uvicorn/celery directly —
full step-by-step in **`docs/setup-no-docker.md`**.

---

## Run the full app (backend + frontend) for testing

1. **Backend** (this repo): `docker compose up -d` → API on `:8000`.
2. **Frontend** (`Whatly-frontend` repo): set `BACKEND_INTERNAL_URL=http://localhost:8000`
   in its `.env.local`, then `npm run dev` → app on `:3000`.

The frontend proxies `/api/*` to this backend, so the browser only ever talks
to `:3000`.

---

## 📱 Test on a phone (Windows) — port forwarding

You test the **full app**, so you tunnel the **frontend** (it proxies `/api/*`
to this backend). Run both as above, then in the **frontend** repo:

```powershell
winget install --id Cloudflare.cloudflared      # once
cloudflared tunnel --url http://localhost:3000
```
Open the printed `https://*.trycloudflare.com` URL on your phone. (Same-WiFi
alternative: `http://<your-PC-LAN-IP>:3000`.) Full details in the frontend
repo's README.

**Expose only this API** (rarely needed — e.g. real Meta/Razorpay webhooks):
```powershell
cloudflared tunnel --url http://localhost:8000
```

> ⚠️ A public tunnel exposes your local server to the internet while it runs.
> Don't post the link; stop the tunnel when done. Dev mode lets anyone with the
> link sign up — see `docs/dev-mode.md`.

---

## Testing without Meta WhatsApp credentials

`APP_ENV=development` enables a signup bypass — no real WhatsApp number needed.
See **`docs/dev-mode.md`**.

---

## Database migrations

```bash
docker compose exec backend alembic upgrade head           # apply latest
docker compose exec backend alembic revision --autogenerate -m "msg"   # new migration
```
Re-run `upgrade head` after every pull that ships a migration. If you ever see
`relation "..." does not exist`, you skipped this step.

---

## Repo layout

```
app/          FastAPI app — api/ · services/ · models/ · schemas/ · workers/ · core/
alembic/      database migrations (alembic.ini at root)
data/         intent_packs/ (business-type Q&A packs) · intents/ (global)
scripts/      create_superuser, test_intent_packs, …
tests/        pytest suite
docs/         setup, setup-no-docker, deployment, infra-services,
              dev-mode, share-testing, gst, business, revenue, …
pyproject.toml · Dockerfile
docker-compose.yml   postgres · redis · backend · worker · beat · adminer · flower
```
> The Docker **service** is still named `backend` — commands like
> `docker compose exec backend …` are unchanged; only the folder layout flattened.

## Deploy to production
See **`docs/deployment.md`** (Caddy + auto-SSL) and **`docs/setup.md`** §10.

# Campus Hub

Full-stack campus community platform with:

- Marketplace (buy/sell + wishlist)
- Study groups + session reminders
- Messaging + notifications
- Campus map

## Repos

- `backend/` – Node/Express/MongoDB API
- `frontend/` – React/Vite app

## Quick Start

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment

See:

- `backend/README.md` for API env vars and setup
- `frontend/README.md` for UI setup and API base URL config

## Notes

- If API base URL differs from `http://localhost:8000`, update `frontend/src/api/axios.js` and `frontend/src/utils/socket.js`.

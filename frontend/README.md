# Campus Hub – Frontend

React + Vite frontend for Campus Hub.

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Axios
- Socket.io client
- React Leaflet
- Framer Motion (minimal use)

## Setup

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Configuration

Update API base URL in:

- `frontend/src/api/axios.js`
- `frontend/src/utils/socket.js`

Default values currently point to `http://localhost:8000` for API + socket.

## Features

- Marketplace (listings, wishlist, status)
- Study groups + sessions
- Messages + notifications
- Seller profile
- Settings & profile
- Leaflet campus map

## Project Structure

```bash
frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── context/
│   ├── hooks/
│   └── utils/
├── index.html
└── vite.config.js
```

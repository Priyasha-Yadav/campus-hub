# Campus Hub

Campus Hub is a full-stack campus community platform for students to buy and sell items, form study groups, message in real-time, receive notifications, and navigate campus resources.

## Links
- [Live Demo](https://campus-hub-livid.vercel.app/)
- [Backend Server](https://campus-hub-bng6.onrender.com)
- [Backend Repo](https://github.com/Priyasha-Yadav/campus-hub/tree/main/backend)
- [Frontend Repo](https://github.com/Priyasha-Yadav/campus-hub/tree/main/frontend)
- [API Documentation](https://documenter.getpostman.com/view/39189648/2sBXqFP35u)

## Highlights

- Marketplace: create listings, upload images, save wishlist items, and mark items sold
- Study groups: create and manage groups, join/leave, share links, schedule sessions
- Messaging: real-time one-to-one chat with read states via Socket.IO
- Notifications: in-app notification feed for marketplace and study activity
- User settings: profile avatar upload, privacy and notification preferences, payment details
- Campus map: dedicated map/info experience in the frontend

## Monorepo Layout

```
campus-hub/
|- backend/   # Node.js + Express + MongoDB API
|- frontend/  # React + Vite web app
`- README.md  # This file
```

## System Architecture

### Frontend

- React 19 + Vite
- Tailwind CSS UI
- Axios API client
- Socket.IO client for real-time chat events
- Route-level code splitting and vendor chunk splitting for better bundle performance

### Backend

- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication
- Socket.IO server for real-time messaging
- Cloudinary-backed image uploads (avatar, listings, study group cover, payment QR)
- Scheduled reminders for upcoming study sessions

## Core Modules

- Auth and user lifecycle
- University-scoped content filtering
- Marketplace listings and wishlist
- Study groups and session planning
- Conversations and messages
- Notifications
- Dashboard summary

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or hosted)
- Cloudinary account (for media uploads)

## Local Development Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd campus-hub

cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure backend environment

Create `backend/.env` with values similar to:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/campus-hub
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Notes:
- If `PORT` is not set, backend falls back to `5001`.
- Frontend defaults to deployed API/socket at `https://campus-hub-bng6.onrender.com`.
- You can override frontend endpoints with:
	- `VITE_API_BASE_URL` (for REST API, including `/api`)
	- `VITE_SOCKET_URL` (for Socket.IO server root URL)

### 3. Start services

Backend terminal:

```bash
cd backend
npm run dev
```

Frontend terminal:

```bash
cd frontend
npm run dev
```

## Scripts

### Backend (`backend/package.json`)

- `npm run dev` - start with nodemon
- `npm run start` - start with node

### Frontend (`frontend/package.json`)

- `npm run dev` - Vite dev server
- `npm run build` - production build
- `npm run lint` - ESLint checks
- `npm run preview` - preview production build

## API Surface (High Level)

- `/api/auth` - signup, login, forgot/reset password
- `/api/users` - profile, avatar upload, settings, saved listings, account delete
- `/api/listings` - CRUD, status updates, image uploads
- `/api/study-groups` - CRUD, join/leave, covers, session info
- `/api/conversations` and `/api/messages` - chat and message history
- `/api/notifications` - notification feed and read status
- `/api/dashboard` - summary widgets
- `/api/health` - health check

## Realtime and Background Jobs

- Socket.IO powers message delivery and read receipts.
- Study group reminder job runs periodically and creates notifications for upcoming sessions.

## Configuration Pointers

If your backend host/port changes, update:

- `VITE_API_BASE_URL`
- `VITE_SOCKET_URL`

If your frontend URL changes, update backend CORS origin:

- `backend/.env` (`CLIENT_URL`)

## Quality and Build Status

Current project workflow includes:

- Frontend lint checks (`npm run lint`)
- Frontend production build (`npm run build`)
- Backend startup smoke validation (`npm run start`)

## Troubleshooting

### Frontend cannot reach API

- Confirm backend is running
- Verify `frontend/src/api/axios.js` base URL matches backend port
- Verify `CLIENT_URL` in backend env allows your frontend origin

### Image uploads fail

- Verify Cloudinary credentials in `backend/.env`
- Check file type and size limits in upload middleware

### Auth issues after login

- Confirm JWT secret is set and consistent
- Clear stale local storage token/user and login again

## Additional Documentation

- `backend/README.md` for backend-specific implementation details
- `frontend/README.md` for frontend-specific setup and architecture

# Campus Hub – Backend

Backend service for **Campus Hub**, a student-focused platform with:

- Marketplace (listings, wishlist, status)
- Study Groups (join/leave, sessions, reminders)
- Real-time messaging + notifications
- JWT-based authentication

Built with **Node.js, Express, MongoDB, and Socket.io**.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.io (real-time chat)
- Helmet & CORS (security)
- Cloudinary (image uploads)

---

## Project Structure

```bash
backend/
├── src/
│   ├── server.js
│   ├── app.js
│
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│
│   ├── models/
│   │   ├── User.js
│   │   ├── University.js       
│   │   ├── Listing.js
│   │   ├── StudyGroup.js
│   │   ├── Conversation.js
│   │   ├── Message.js
│   │   └── Notification.js
│
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── universities.controller.js  
│   │   ├── listings.controller.js
│   │   ├── studyGroups.controller.js
│   │   ├── conversations.controller.js
│   │   ├── messages.controller.js
│   │   ├── notifications.controller.js
│   │   └── dashboard.controller.js
│
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── universities.routes.js        
│   │   ├── listings.routes.js
│   │   ├── studyGroups.routes.js
│   │   ├── conversations.routes.js
│   │   ├── messages.routes.js
│   │   ├── notifications.routes.js
│   │   └── dashboard.routes.js
│
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── universityScope.js     
│   │   ├── uploadAvatar.js
│   │   ├── uploadListingImages.js
│   │   ├── uploadStudyGroupCover.js
│   │   ├── uploadPaymentQr.js
│   │   └── error.js
│
│   ├── socket/
│   │   └── chat.socket.js
│   ├── jobs/
│   │   └── studyGroupReminder.job.js
│
│   └── utils/
│       ├── jwt.js
│       └── response.js
│
├── .env
├── package.json
└── README.md
```

---

## Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in `backend/`:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/campus-hub
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Optional
CAMPUS_LOCATIONS_COUNT=10
```

### 3. Run the Server

```bash
npm run dev
```

Server runs at `http://localhost:5001`.

Health check: `GET /api/health`

---

## Authentication

Protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

JWT is returned on **signup** and **login**.

---

## Key Endpoints (high level)

- Auth: `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`
- Listings: `GET /api/listings`, `POST /api/listings`, `PUT /api/listings/:id`, `PATCH /api/listings/:id/status`, `POST /api/listings/:id/images`, `DELETE /api/listings/:id`
- Study Groups: `GET /api/study-groups`, `GET /api/study-groups/upcoming`, `POST /api/study-groups`, `PUT /api/study-groups/:id`, `PUT /api/study-groups/:id/next-session`, `POST /api/study-groups/:id/cover`, `POST /api/study-groups/:id/join`, `POST /api/study-groups/:id/leave`, `DELETE /api/study-groups/:id`
- Notifications: `GET /api/notifications`, `PUT /api/notifications/:id/read`, `PUT /api/notifications/read-all`
- Dashboard: `GET /api/dashboard/summary`
- Users: `GET /api/users/me`, `GET /api/users/settings`, `PUT /api/users/payment-info`, `PUT /api/users/payment-qr`, `POST /api/users/saved-listings/:listingId`, `DELETE /api/users/me`

## Jobs

- `studyGroupReminder.job.js` runs every 10 minutes and sends in-app notifications for upcoming sessions.

---


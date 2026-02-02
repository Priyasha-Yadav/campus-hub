# Campus Hub – Backend

Backend service for **Campus Hub**, a student-focused platform that provides:

- Marketplace (buy/sell items)
- Study Groups
- Real-time messaging
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
│   │   └── Message.js
│
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── universities.controller.js  
│   │   ├── listings.controller.js
│   │   ├── studyGroups.controller.js
│   │   ├── conversations.controller.js
│   │   └── messages.controller.js
│
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── universities.routes.js        
│   │   ├── listings.routes.js
│   │   ├── studyGroups.routes.js
│   │   ├── conversations.routes.js
│   │   └── messages.routes.js
│
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── universityScope.js     
│   │   └── error.js
│
│   ├── socket/
│   │   └── chat.socket.js
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
```

### 3. Run the Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:5001
```

Health check:

```
GET /api/health
```

---

## Authentication

Protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

JWT is returned on **signup** and **login**.

---

## Example API Requests

### Signup

```http
POST /api/auth/signup
```

```json
{
  "email": "student@college.edu",
  "password": "password123",
  "displayName": "Jane Doe"
}
```

---



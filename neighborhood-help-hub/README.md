# Neighborhood Help Hub

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Neighborhood Help Hub is a MERN (MongoDB, Express.js, React, Node.js) application designed to help residents of a neighborhood connect, share resources, and seek assistance efficiently. This platform allows users to create profiles, chat with neighbors, post help requests, and manage local community tasks.
for new messages and updates

---

## Technologies

- **Frontend:** React.js, HTML5, CSS3, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Atlas / Compass)  
- **Other:** Axios, JWT, bcrypt, Socket.io (for chat functionality)

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/Junaidbadin/neighborhours-help-hub.git
cd neighborhours-help-hub
### 2. Install Dependencies & Run

**Server (Terminal 1):**
```bash
cd neighborhood-help-hub/server
npm install
npm run dev
```

**Client (Terminal 2):**
```bash
cd neighborhood-help-hub/client
npm install
npm run dev
```

### 3. Access the Application

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000/api
- **MongoDB:** localhost:27017

## 📁 Project Structure

```
neighborhood-help-hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── slices/        # Redux slices
│   │   ├── store/         # Redux store
│   │   └── utils/         # Utilities
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middlewares/       # Custom middlewares
│   ├── uploads/           # File uploads (auto-created)
│   ├── server.js          # Server entry point
│   └── package.json
│
├── MONGODB_SETUP.md       # MongoDB installation guide
└── SETUP_COMPLETE.md      # Setup instructions
```



## 📝 Environment Variables

### Server (.env)
```env
# MongoDB Local Connection
MONGODB_URI=mongodb://localhost:27017/neighborhood-help-hub

# Server Settings
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=neighborhood-help-hub-secret-key-2024
JWT_REFRESH_SECRET=neighborhood-help-hub-refresh-secret-key-2024
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Features

-  User Authentication (Register, Login, Password Reset)
-  Post Management (Create, Edit, Delete Help Requests/Offers)
-  Real-time Chat with Socket.io
-  Location-based Search
-  User Profiles and Ratings
-  Admin Dashboard
-  File Uploads (Profile Pictures, Post Images)




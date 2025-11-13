# Neighborhood Help Hub - Local Development Setup

## ✅ All Issues Fixed - Ready for Local Development!

This application now uses **local MongoDB** instead of cloud database. All errors have been fixed and the application is ready to run on your laptop.

## 🚀 Quick Start

### Prerequisites
- Node.js installed on your system
- MongoDB installed locally (see installation guide below)

### 1. Install MongoDB

**Download and install MongoDB Community Edition:**
- Website: https://www.mongodb.com/try/download/community
- Platform: Select your operating system (Windows/Mac/Linux)
- Version: Download the latest stable version
- Install and start as a service

**Verify installation:**
```bash
mongod --version
```

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

## 📋 What Was Fixed

✅ **Database:** Switched from MongoDB Atlas to local MongoDB  
✅ **File Uploads:** Changed from Cloudinary to local file storage  
✅ **Redux Store:** Fixed import paths for all slices  
✅ **App.jsx:** Added missing `Link` import from react-router-dom  
✅ **Auth Middleware:** Fixed JWT_SECRET references  
✅ **Post Routes:** Fixed model reference  
✅ **Static Files:** Added uploads directory serving

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

## 🗄️ Database

The application uses **local MongoDB** at:
```
mongodb://localhost:27017/neighborhood-help-hub
```

Database and collections are created automatically when you:
1. Install MongoDB
2. Start the MongoDB service
3. Run the server for the first time

## 💾 File Uploads

User uploads (profile pictures, post images) are stored in:
```
server/uploads/
```

This directory is created automatically when first upload is made.

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

- ✅ User Authentication (Register, Login, Password Reset)
- ✅ Post Management (Create, Edit, Delete Help Requests/Offers)
- ✅ Real-time Chat with Socket.io
- ✅ Location-based Search
- ✅ User Profiles and Ratings
- ✅ Admin Dashboard
- ✅ File Uploads (Profile Pictures, Post Images)

## 🔧 Troubleshooting

### MongoDB Won't Start
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### Port Already in Use
Edit `server/.env` and change the port number.

### Connection Refused
1. Verify MongoDB is running: `mongod --version`
2. Check `.env` file has correct connection string
3. Ensure firewall isn't blocking port 27017

## 📚 Documentation

- **MongoDB Setup:** See `MONGODB_SETUP.md` for detailed installation instructions
- **Setup Complete:** See `SETUP_COMPLETE.md` for step-by-step setup guide

## 🎉 You're All Set!

The application is now configured for local development. All cloud dependencies have been removed and replaced with local equivalents.

**Ready to start coding! 🚀**

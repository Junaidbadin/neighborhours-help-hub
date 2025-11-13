## Neighborhood Help Hub — Project Explanation

This document explains the structure, responsibilities, and data flow of the project so new contributors can quickly understand how everything fits together.

### 1) File Overview

- **Root**
  - `README.md`: High-level setup and usage instructions.
  - `API_ENDPOINTS.md`: Reference of API endpoints for the app.
  - `COMPONENT_IMPLEMENTATION.md`: Notes on component implementations.
  - `MONGODB_SETUP.md`: MongoDB installation/connection guide.
  - `POSTMAN_API_COLLECTION.md` / `POSTMAN_Collection.json`: Postman collection and instructions for API testing.
  - `SETUP_COMPLETE.md` / `SETUP_COMPLETE.txt`: Setup status markers.

- **neighborhood-help-hub/client**: Frontend React app (Vite + React + Redux Toolkit + TailwindCSS)
  - `index.html`: Vite HTML scaffold for the React app.
  - `package.json` / `package-lock.json`: Frontend dependencies and scripts.
  - `vite.config.js`: Vite build/dev server configuration.
  - `tailwind.config.js` / `postcss.config.js`: Tailwind and PostCSS configuration.
  - `public/`: Static assets copied as-is to build output.
  - `dist/`: Production build output (generated).
  - `src/`: Application source code
    - `main.jsx`: React bootstrap (creates root and renders `App`).
    - `App.jsx`: App shell; sets up Router, Providers, layout, routes, and `GlobalLoading`.
    - `style.css`: Global styles and Tailwind component classes.
    - `api/endpoints.js`: Plain constants for API endpoint URLs (legacy/simple usage).
    - `utils/api.js`: Axios instance, interceptors (auth tokens/refresh), and typed API helpers organized by domain.
    - `contexts/`
      - `AuthContext.jsx`: Exposes auth state (`isAuthenticated`, `user`, etc.) and ensures profile fetching when needed.
      - `SocketContext.jsx`: Provides socket connection (used for real-time chat/notifications).
    - `components/`
      - `auth/ProtectedRoute.jsx`: Route guard to restrict routes to authenticated (and optionally admin) users.
      - `layout/Navbar.jsx`: Global navigation bar.
      - `layout/Footer.jsx`: Global footer.
      - `layout/GlobalLoading.jsx`: Full-screen loading overlay (now non-blocking via `pointer-events-none`).
    - `pages/`
      - `Home.jsx`: Landing/homepage.
      - `Search.jsx`: Search UI for posts/users.
      - `Posts.jsx` / `PostDetail.jsx`: Post listing and single post view.
      - `CreatePost.jsx` / `EditPost.jsx`: Post creation/editing flows.
      - `Dashboard.jsx`: User dashboard (protected).
      - `Profile.jsx` / `EditProfile.jsx`: Profile view and editing.
      - `Chat.jsx` / `ChatRoom.jsx`: Messaging UI (real-time via sockets).
      - `About.jsx`, `HelpCenter.jsx`, `ContactUs.jsx`, `PrivacyPolicy.jsx`, `TermsOfService.jsx`: Informational pages.
      - `auth/Login.jsx`, `auth/Register.jsx`, `auth/ForgotPassword.jsx`, `auth/ResetPassword.jsx`: Auth flows.
      - `admin/AdminDashboard.jsx`: Admin-only dashboard.
    - `store/`
      - `index.js`: Configures Redux store with slices.
      - `globalLoadingSlice.js`: Global loading state used by `GlobalLoading` overlay.
    - `slices/`
      - `authSlice.js`: Auth state, thunks (e.g., `fetchProfile`), and reducers.
      - `postSlice.js`: Post list/details, CRUD and related states.
      - `chatSlice.js`: Chat conversations/messages state.
      - `userSlice.js`: User profile/ratings/etc state.
      - `adminSlice.js`: Admin entities and dashboard data.

- **neighborhood-help-hub/server**: Backend Node.js (Express + MongoDB + Socket.io)
  - `server.js`: Backend entry point; configures Express, middleware, MongoDB connection, routes, error handlers, and Socket.io.
  - `package.json` / `package-lock.json`: Backend dependencies and scripts.
  - `routes/`
    - `authRoutes.js`: Auth-related endpoints (login, register, refresh, profile, etc.).
    - `postRoutes.js`: CRUD and workflow for posts.
    - `userRoutes.js`: User public/profile endpoints, ratings, leaderboard, search, etc.
    - `chatRoutes.js`: Messaging-related REST endpoints.
    - `adminRoutes.js`: Admin-only endpoints (analytics, moderation, etc.).
  - `controllers/`
    - `authController.js`, `postController.js`, `userController.js`, `chatController.js`, `adminController.js`: Business logic for each route group.
  - `middlewares/`
    - `auth.js`: Auth checks/authorization guard (JWT verification, role checks).
    - `upload.js`: File upload handling (e.g., Multer setup for images).
  - `models/`
    - `User.js`, `Post.js`, `Message.js`, `Notification.js`, `Rating.js`: Mongoose schemas and models.
  - `uploads/`: Public directory for uploaded files served via `/uploads`.
  - `utils/`: Utility helpers (reserved/expandable; may be empty or minimal initially).

---

### 2) Functional Summary

- **Frontend → Backend connection**
  - Frontend uses Axios (`src/utils/api.js`) to call REST endpoints under `http://localhost:5000/api` (configurable via `VITE_API_URL`).
  - Auth tokens (access/refresh) are stored in `localStorage`; Axios request interceptor adds `Authorization: Bearer <token>` automatically. A response interceptor attempts refresh on 401 and redirects to `/login` if refresh fails.
  - Real-time features (typing indicators, message events, notifications) use Socket.io. The backend Socket.io server allows connections from the configured client origin.

- **Data flow (request path)**
  1. React component dispatches a thunk or calls `authAPI`/`postsAPI`/`usersAPI`/`chatAPI`/`adminAPI` in `src/utils/api.js`.
  2. Axios sends request to Express route (`server/routes/*`).
  3. Express routes pass to the appropriate controller (`server/controllers/*`) where business logic runs.
  4. Controllers use Mongoose models (`server/models/*`) to read/write data in MongoDB.
  5. Controller responds with JSON. Axios receives the response; thunks update Redux slices.
  6. Components re-render from updated Redux state and contexts.
  7. For real-time events, clients interact via Socket.io which broadcasts/receives events without page refresh.

- **Responsibility map**
  - Authentication: `authSlice.js`, `AuthContext.jsx`, `server/routes/authRoutes.js`, `server/controllers/authController.js`, `middlewares/auth.js`.
  - Database connection: `server/server.js` (connects to MongoDB using `MONGODB_URI`).
  - Routing (HTTP): `server/routes/*.js` → `server/controllers/*.js`.
  - Sockets: `server/server.js` (Socket.io setup/handlers); `client/src/contexts/SocketContext.jsx` to expose socket to React.
  - UI rendering: React pages/components; layout via `Navbar`, `Footer`, `GlobalLoading`.

---

### 3) Important Components (Frontend)

- **App shell and providers**
  - `App.jsx`: Wraps with `Provider` (Redux), `AuthProvider`, `SocketProvider`, and Router; defines public/protected/admin routes and renders `Navbar`, `Footer`, `GlobalLoading`.
  - `AuthContext.jsx`: Coordinates profile fetch if authenticated but user data not loaded; exposes `isAuthenticated`, `user`, `authChecked`.
  - `SocketContext.jsx`: Initializes and shares a Socket.io client for chat/notification features.

- **Routing & Guards**
  - `ProtectedRoute.jsx`: Wraps protected pages, enforcing authentication (and optional admin check) before rendering.

- **State & APIs**
  - `store/index.js`: Combines slices (`auth`, `posts`, `chat`, `user`, `admin`, `globalLoading`).
  - `utils/api.js`: Central Axios client with auth/refresh interceptors and domain-specific API helpers.
  - `api/endpoints.js`: Simple constants/URLs for direct fetches or legacy code.

- **Key Pages**
  - Posts: `Posts.jsx`, `PostDetail.jsx`, `CreatePost.jsx`, `EditPost.jsx` (CRUD UI, integrates with `postsAPI` and `postSlice`).
  - Auth: `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx` (auth flows via `authAPI` and `authSlice`).
  - Chat: `Chat.jsx`, `ChatRoom.jsx` (conversation list and direct chat, integrates with Socket.io and `chatAPI`).
  - User: `Profile.jsx`, `EditProfile.jsx` (profile view/edit, ratings, etc., via `usersAPI` and `userSlice`).
  - Admin: `admin/AdminDashboard.jsx` (admin overview via `adminAPI`/`adminSlice`).
  - Layout: `Navbar.jsx`, `Footer.jsx`, `GlobalLoading.jsx` (overlay uses `pointer-events-none` so it never blocks clicks).

---

### 4) Backend Structure

- **API Routes**
  - `authRoutes.js`: Registration, login, logout, profile, token refresh, password reset, etc.
  - `postRoutes.js`: Get all posts, create/update/delete post, accept/complete help, nearby posts, user’s posts.
  - `userRoutes.js`: User profile queries, search, leaderboard, ratings, block/report.
  - `chatRoutes.js`: Send/read/delete messages, list conversations, unread counts, search messages.
  - `adminRoutes.js`: Dashboard, analytics, user management, post moderation, and reports.

- **Middlewares**
  - `auth.js`: Protects routes, validates JWT, may enforce roles (e.g., admin).
  - `upload.js`: Handles multipart/form-data for images or attachments and stores files in `uploads/`.

- **Controllers**
  - `authController.js`: Implements auth logic; issues tokens; returns profiles.
  - `postController.js`: Business logic for post CRUD and workflows (accept/complete).
  - `userController.js`: User profile/search/ratings/leaderboard logic.
  - `chatController.js`: Send/read/delete messages and fetch conversations.
  - `adminController.js`: Admin operations and stats aggregation.

- **Models** (Mongoose)
  - `User.js`, `Post.js`, `Message.js`, `Notification.js`, `Rating.js`: MongoDB schemas defining persistence layer for core entities.

- **Server Entry**
  - `server.js`: Sets middleware (Helmet, CORS, logging, rate limit), connects to MongoDB, mounts routes, serves `/uploads`, configures Socket.io (rooms, events like `send-message`, typing indicators), and defines error/404 handlers.

---

### 5) Frontend Structure

- **Pages vs Components**
  - Pages in `src/pages` represent route-level screens.
  - Reusable layout and auth wrappers live in `src/components`.

- **State Management**
  - Redux Toolkit slices under `src/slices/*` manage domain state and expose thunks.
  - `src/store/index.js` registers slices and enables Redux DevTools in non-production.

- **API Calls**
  - `src/utils/api.js` centralizes HTTP logic with automatic auth header injection and token refresh.
  - `src/api/endpoints.js` provides simple URL constants if direct fetches are preferred.

- **UI/Styling**
  - TailwindCSS is used across components/pages. Global utility classes are in `src/style.css` (e.g., `btn-primary`, `card`).
  - `GlobalLoading.jsx` subscribes to `globalLoading` state to show a spinner overlay without blocking interactions.

---

### 6) Final Summary (End-to-End)

- **Architecture**: React (Vite) → Axios → Express (Node) → MongoDB (Mongoose) + Socket.io for realtime.

- **User Login Workflow**
  1. User submits credentials in `Login.jsx`.
  2. `authAPI.login` sends request to `/api/auth/login`.
  3. `authController` validates and issues tokens; frontend stores them.
  4. Axios interceptors include the access token on future requests; `AuthContext`/`authSlice` keep user data in sync.

- **Post Creation Workflow**
  1. User fills `CreatePost.jsx` form.
  2. `postsAPI.createPost` sends to `/api/posts` (auth-protected).
  3. `postController` creates the post in MongoDB via `Post` model.
  4. Response updates Redux state; UI lists/redirects to the new post.

- **Data Rendering**
  - Pages select data from Redux slices and render components. Updates propagate automatically via React state changes.

- **Real-time Messaging**
  - `ChatRoom.jsx` uses Socket.io from `SocketContext` to join rooms, send messages, and receive events (`receive-message`, typing indicators). The server mirrors events while also persisting messages.

This modular structure cleanly separates concerns: React handles UI and state, Axios bridges to the API, Express routes delegate to controllers, and Mongoose manages persistence, with Socket.io enabling real-time features.








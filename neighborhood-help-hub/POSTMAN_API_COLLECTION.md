# Neighborhood Help Hub - API Documentation for Postman

Base URL: `http://localhost:5000/api`

## Authentication
Most endpoints require a JWT Bearer token in the Authorization header:
```
Authorization: Bearer <your-token>
```

---

## 🟢 AUTH APIs (`/api/auth`)

### 1. Register User
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/register`
- **Auth:** Not Required
- **Body (JSON):**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

### 2. Login
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/login`
- **Auth:** Not Required
- **Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Refresh Token
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/refresh-token`
- **Auth:** Not Required
- **Body (JSON):**
```json
{
  "refreshToken": "<refresh-token>"
}
```

### 4. Forgot Password
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/forgot-password`
- **Auth:** Not Required
- **Body (JSON):**
```json
{
  "email": "john@example.com"
}
```

### 5. Reset Password
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/reset-password`
- **Auth:** Not Required
- **Body (JSON):**
```json
{
  "token": "<reset-token>",
  "password": "newpassword123"
}
```

### 6. Get Profile
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/auth/profile`
- **Auth:** Required

### 7. Update Profile
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/auth/profile`
- **Auth:** Required
- **Body (JSON):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

### 8. Update Location
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/auth/location`
- **Auth:** Required
- **Body (JSON):**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "New York, NY"
}
```

### 9. Logout
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/logout`
- **Auth:** Required

---

## 📝 POST APIs (`/api/posts`)

### 1. Get All Posts
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/posts`
- **Query Params (optional):**
  - `page` - Page number
  - `limit` - Items per page
  - `category` - Filter by category
  - `search` - Search term

### 2. Get Nearby Posts
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/posts/nearby`
- **Query Params:**
  - `latitude` - Your latitude
  - `longitude` - Your longitude
  - `radius` - Radius in km (optional)
  - `page` - Page number (optional)
  - `limit` - Items per page (optional)

### 3. Get Post by ID
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/posts/:id`
- **Auth:** Not Required (but recommended)

### 4. Create Post
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/posts`
- **Auth:** Required
- **Content-Type:** `multipart/form-data` or `application/json`
- **Body:**
```json
{
  "title": "Need help moving furniture",
  "description": "Looking for someone to help me move my couch",
  "category": "Moving Help",
  "urgency": "medium",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "123 Main St, New York"
}
```

### 5. Update Post
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/posts/:id`
- **Auth:** Required (Owner only)
- **Body (JSON):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "category": "Updated Category",
  "urgency": "high"
}
```

### 6. Delete Post
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/posts/:id`
- **Auth:** Required (Owner only)

### 7. Accept Help
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/posts/:id/accept`
- **Auth:** Required
- **Body (JSON):**
```json
{
  "helperId": "<user-id>"
}
```

### 8. Complete Help
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/posts/:id/complete`
- **Auth:** Required (Post owner)
- **Body (JSON):**
```json
{
  "completed": true
}
```

### 9. Get User Posts
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/posts/user/:userId`
- **Auth:** Required
- **Query Params (optional):**
  - `page`
  - `limit`
  - `status`

---

## 👥 USER APIs (`/api/users`)

### 1. Search Users
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users/search`
- **Query Params:**
  - `query` - Search term
  - `page` (optional)
  - `limit` (optional)

### 2. Get Leaderboard
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users/leaderboard`
- **Query Params (optional):**
  - `limit` - Number of top users
  - `period` - Time period (day/week/month/all)

### 3. Get User Profile
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users/:userId`

### 4. Get User Ratings
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users/:userId/ratings`
- **Query Params (optional):**
  - `page`
  - `limit`

### 5. Rate User
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/users/:userId/rate`
- **Auth:** Required
- **Body (JSON):**
```json
{
  "rating": 5,
  "comment": "Great helper!"
}
```

### 6. Block User
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/users/:userId/block`
- **Auth:** Required

### 7. Report User
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/users/:userId/report`
- **Auth:** Required
- **Body (JSON):**
```json
{
  "reason": "Inappropriate behavior",
  "description": "User sent offensive messages"
}
```

### 8. Update User Profile
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/users/update`
- **Auth:** Required
- **Content-Type:** `multipart/form-data`
- **Body (Form Data):**
  - `profilePic` - Image file
  - Other profile fields

---

## 💬 CHAT APIs (`/api/chat`)

### 1. Send Message
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/chat/send`
- **Auth:** Required
- **Body (JSON):**
```json
{
  "receiverId": "<user-id>",
  "content": "Hello!"
}
```

### 2. Get Conversations
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/chat/conversations`
- **Auth:** Required

### 3. Get Conversation with User
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/chat/conversation/:userId`
- **Auth:** Required
- **Query Params (optional):**
  - `page`
  - `limit`

### 4. Mark Messages as Read
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/chat/read/:userId`
- **Auth:** Required

### 5. Get Unread Count
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/chat/unread-count`
- **Auth:** Required

### 6. Delete Message
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/chat/message/:messageId`
- **Auth:** Required

### 7. Search Messages
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/chat/search`
- **Auth:** Required
- **Query Params:**
  - `query` - Search term
  - `page` (optional)
  - `limit` (optional)

---

## 👑 ADMIN APIs (`/api/admin`)

**All Admin APIs require:**
- Authentication token
- Admin role in user account

### 1. Get Dashboard Stats
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/admin/dashboard`
- **Auth:** Required (Admin)

### 2. Get All Users
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/admin/users`
- **Auth:** Required (Admin)
- **Query Params (optional):**
  - `page`
  - `limit`
  - `status`
  - `search`

### 3. Get All Posts
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/admin/posts`
- **Auth:** Required (Admin)
- **Query Params (optional):**
  - `page`
  - `limit`
  - `status`
  - `search`

### 4. Toggle User Status
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/admin/users/:userId/status`
- **Auth:** Required (Admin)
- **Body (JSON):**
```json
{
  "isActive": false,
  "reason": "Violated community guidelines"
}
```

### 5. Delete Post (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/admin/posts/:postId`
- **Auth:** Required (Admin)
- **Body (JSON):**
```json
{
  "reason": "Inappropriate content"
}
```

### 6. Get Reports
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/admin/reports`
- **Auth:** Required (Admin)
- **Query Params (optional):**
  - `page`
  - `limit`
  - `type`
  - `status`

### 7. Get Analytics
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/admin/analytics`
- **Auth:** Required (Admin)
- **Query Params (optional):**
  - `period` - Time period (day/week/month/year)

---

## 🏥 Health Check

### Health Check
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/health`
- **Auth:** Not Required

---

## 📋 Testing in Postman

### Setup Instructions:

1. **Start the server:**
   ```bash
   cd neighborhood-help-hub/server
   npm install
   npm start
   ```
   Server will run on `http://localhost:5000`

2. **Create a new Postman Collection:**
   - Import this documentation
   - Create folders for each category (Auth, Posts, Users, Chat, Admin)

3. **Test Flow:**
   - First, register a new user using `/api/auth/register`
   - Login using `/api/auth/login` to get the access token
   - Copy the access token from the response
   - Add it to the Authorization header as `Bearer <token>`
   - Now test other protected endpoints

4. **Environment Variables in Postman:**
   - Create a Postman environment
   - Add variable `base_url` = `http://localhost:5000/api`
   - Add variable `token` = `<your-access-token>` (after login)
   - Use `{{base_url}}` and `{{token}}` in your requests

### Example Postman Setup:
- **Collection Name:** Neighborhood Help Hub API
- **Base URL:** Use environment variable `{{base_url}}`
- **Auth Type:** Bearer Token
- **Token:** Use environment variable `{{token}}`

---

## 🔐 Important Notes:

1. **Rate Limiting:** All auth endpoints have rate limiting (5 requests per 15 minutes per IP)
2. **File Uploads:** Some endpoints support file uploads - use `multipart/form-data` content type
3. **Pagination:** Most list endpoints support pagination with `page` and `limit` query params
4. **Socket.IO:** Chat features use WebSocket connections on the same port
5. **CORS:** Enabled for `http://localhost:5173` (or configured client URL)

---

## 📝 Response Format

All API responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error info"
}
```
















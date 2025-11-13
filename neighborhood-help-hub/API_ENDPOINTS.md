# Neighborhood Help Hub - API Endpoints Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### POST /auth/register
Register a new user
- **Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "city": "string",
    "address": "string (optional)",
    "age": "number (optional)",
    "gender": "string (optional)",
    "skills": "array (optional)",
    "longitude": "number (optional)",
    "latitude": "number (optional)"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "string",
        "city": "string",
        "rating": "number",
        "helpPoints": "number",
        "badge": "string",
        "profilePic": "string"
      },
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
  ```

### POST /auth/login
Login user
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "string",
        "city": "string",
        "rating": "number",
        "helpPoints": "number",
        "badge": "string",
        "profilePic": "string"
      },
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
  ```

### POST /auth/refresh-token
Refresh access token
- **Body:**
  ```json
  {
    "refreshToken": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
  ```

### POST /auth/forgot-password
Request password reset
- **Body:**
  ```json
  {
    "email": "string"
  }
  ```

### POST /auth/reset-password
Reset password with token
- **Body:**
  ```json
  {
    "token": "string",
    "password": "string"
  }
  ```

### GET /auth/profile
Get user profile (Protected)
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "city": "string",
      "rating": "number",
      "helpPoints": "number",
      "badge": "string",
      "profilePic": "string",
      "location": {
        "type": "Point",
        "coordinates": [number, number],
        "address": "string"
      }
    }
  }
  ```

### PUT /auth/profile
Update user profile (Protected)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "string",
    "age": "number",
    "gender": "string",
    "city": "string",
    "address": "string",
    "skills": "array",
    "profilePic": "string"
  }
  ```

### PUT /auth/location
Update user location (Protected)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "longitude": "number",
    "latitude": "number",
    "address": "string"
  }
  ```

### POST /auth/logout
Logout user (Protected)
- **Headers:** `Authorization: Bearer <token>`

## Posts Endpoints

### GET /posts
Get all posts
- **Query Parameters:**
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
  - `category`: string
  - `status`: string
  - `city`: string
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "posts": [
        {
          "_id": "string",
          "title": "string",
          "description": "string",
          "category": "string",
          "status": "string",
          "author": {
            "_id": "string",
            "name": "string",
            "profilePic": "string"
          },
          "createdAt": "string",
          "updatedAt": "string"
        }
      ],
      "currentPage": "number",
      "totalPages": "number",
      "total": "number"
    }
  }
  ```

### GET /posts/:id
Get post by ID
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "post": {
        "_id": "string",
        "title": "string",
        "description": "string",
        "category": "string",
        "status": "string",
        "author": "object",
        "helper": "object",
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
  }
  ```

### POST /posts
Create new post (Protected)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "category": "string",
    "images": "array of files (optional)"
  }
  ```

### PUT /posts/:id
Update post (Protected)
- **Headers:** `Authorization: Bearer <token>`

### DELETE /posts/:id
Delete post (Protected)
- **Headers:** `Authorization: Bearer <token>`

### GET /posts/user/:id
Get posts by user ID
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "posts": "array of post objects"
    }
  }
  ```

### PATCH /posts/:id/accept
Accept help for post (Protected)
- **Headers:** `Authorization: Bearer <token>`

### PATCH /posts/:id/complete
Mark post as completed (Protected)
- **Headers:** `Authorization: Bearer <token>`

## Chat Endpoints

### GET /chat/conversations
Get user conversations (Protected)
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "conversations": [
        {
          "_id": "string",
          "sender": "object",
          "receiver": "object",
          "lastMessage": "object",
          "unreadCount": "number",
          "updatedAt": "string"
        }
      ]
    }
  }
  ```

### GET /chat/conversation/:userId
Get conversation with specific user (Protected)
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page`: number
  - `limit`: number

### POST /chat/send
Send message (Protected)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "receiverId": "string",
    "message": "string",
    "type": "string (text/image/file)"
  }
  ```

### GET /chat/unread-count
Get unread message count (Protected)
- **Headers:** `Authorization: Bearer <token>`

## User Endpoints

### GET /users/:id
Get user profile by ID
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "user": "user object"
    }
  }
  ```

### GET /users/posts
Get current user's posts (Protected)
- **Headers:** `Authorization: Bearer <token>`

### POST /users/:id/rate
Rate user (Protected)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "rating": "number (1-5)",
    "comment": "string"
  }
  ```

## Admin Endpoints

### GET /admin/dashboard
Get admin dashboard stats (Protected - Admin only)
- **Headers:** `Authorization: Bearer <token>`

### GET /admin/users
Get all users (Protected - Admin only)
- **Headers:** `Authorization: Bearer <token>`

### GET /admin/posts
Get all posts (Protected - Admin only)
- **Headers:** `Authorization: Bearer <token>`

### PUT /admin/users/:id/status
Toggle user status (Protected - Admin only)
- **Headers:** `Authorization: Bearer <token>`

### DELETE /admin/posts/:id
Delete post (Protected - Admin only)
- **Headers:** `Authorization: Bearer <token>`

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- Auth endpoints: 20 requests per 15 minutes
- Other endpoints: 1000 requests per 15 minutes
- Rate limiting is disabled for health checks

## Authentication

Most endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

The access token is obtained from the login or register endpoints and should be refreshed using the refresh token when it expires.







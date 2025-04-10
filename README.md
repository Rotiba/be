# Video Platform Backend API

This is a Node.js/Express backend application for a simple video platform. It provides APIs for user authentication, video uploading/streaming (via Azure Blob Storage links), commenting, rating, and searching videos.

## Features

- User Registration (consumer role by default)
- User Login (JWT-based authentication)
- Creator Account Creation (via an admin endpoint)
- Video Upload (restricted to 'creator' role, uploads to Azure Blob Storage)
- List All Videos
- Get Specific Video Details (including comments and average rating)
- Add Comments to Videos (authenticated users)
- Rate Videos (authenticated users, 1-5 stars, handles updates)
- Search Videos (by title, publisher, producer, or genre)

## Technologies Used

- **Node.js:** JavaScript runtime environment
- **Express.js:** Web framework for Node.js
- **Tedious:** TDS module for connecting to SQL Server databases
- **Azure Blob Storage:** For storing video files (`@azure/storage-blob`)
- **JSON Web Tokens (JWT):** For user authentication (`jsonwebtoken`)
- **Multer:** Middleware for handling `multipart/form-data` (file uploads)
- **dotenv:** Loads environment variables from a `.env` file
- **cors:** Enables Cross-Origin Resource Sharing

## Prerequisites

- Node.js and npm (or yarn) installed
- Access to a Microsoft SQL Server instance
- An Azure Storage Account with a Blob container

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Create a `.env` file:**
    Create a file named `.env` in the root directory and add the necessary environment variables (see below).

4.  **Database Setup:**
    Ensure your SQL Server database has the required tables. You'll need at least:
    - `Users` (id, username, password, role)
    - `Videos` (id, title, publisher, producer, genre, ageRating, blobUrl, uploaderId, uploadDate)
    - `Comments` (id, videoId, userId, comment, createdAt)
    - `Ratings` (id, videoId, userId, rating)
    - Make sure `uploadDate` and `createdAt` have default values like `GETDATE()`.
    - Add appropriate foreign key constraints (e.g., `Videos.uploaderId` -> `Users.id`, `Comments.videoId` -> `Videos.id`, etc.).

## Environment Variables (`.env`)

Create a `.env` file in the root of the project with the following variables:

```dotenv
# SQL Server Configuration
SQL_SERVER=your_sql_server_name.database.windows.net
SQL_USER=your_sql_username
SQL_PASSWORD=your_sql_password
SQL_DATABASE=your_sql_database_name

# Azure Storage Configuration
STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
STORAGE_CONTAINER=your_blob_container_name

# JWT Configuration
JWT_SECRET=your_strong_jwt_secret_key # Replace with a secure random string

# Server Port (Optional)
PORT=3000
```

````

## Running the Server

```bash
npm start
# or
node server.js # Or whatever your main file is named
```

The server will start, typically on port 3000 (or the port specified in `.env`).

## API Endpoints

### Authentication

- **`POST /api/login`**

  - **Description:** Authenticates a user and returns a JWT.
  - **Request Body:** `{ "username": "string", "password": "string" }`
  - **Response (Success):** `200 OK` - `{ "token": "jwt_token", "user": { "id": number, "username": "string", "role": "string" } }`
  - **Response (Error):** `401 Unauthorized`, `500 Internal Server Error`

- **`POST /api/register`**

  - **Description:** Registers a new user (defaults to 'consumer' role).
  - **Request Body:** `{ "username": "string", "password": "string", "role": "consumer" (optional) }`
  - **Response (Success):** `201 Created` - `{ "message": "User registered successfully" }`
  - **Response (Error):** `400 Bad Request` (Username exists), `500 Internal Server Error`

- **`POST /api/admin/create-creator`**
  - **Description:** Creates a new user with the 'creator' role. (Note: This endpoint lacks admin authentication in the provided code - consider adding middleware).
  - **Request Body:** `{ "username": "string", "password": "string" }`
  - **Response (Success):** `201 Created` - `{ "message": "Creator account created successfully" }`
  - **Response (Error):** `400 Bad Request` (Username exists), `500 Internal Server Error`

### Videos

- **`GET /api/videos`**

  - **Description:** Retrieves a list of all videos, ordered by upload date.
  - **Authentication:** None required.
  - **Response (Success):** `200 OK` - `[ { "id": number, "title": "string", ..., "uploaderName": "string" }, ... ]`
  - **Response (Error):** `500 Internal Server Error`

- **`GET /api/videos/:id`**

  - **Description:** Retrieves details for a specific video, including comments and average rating.
  - **Authentication:** None required.
  - **Response (Success):** `200 OK` - `{ "id": number, ..., "uploaderName": "string", "comments": [...], "averageRating": number, "ratingCount": number }`
  - **Response (Error):** `404 Not Found`, `500 Internal Server Error`

- **`POST /api/videos`**
  - **Description:** Uploads a new video. Requires 'creator' role.
  - **Authentication:** JWT Token required (`Authorization: Bearer <token>`). User must have `role: 'creator'`.
  - **Request Type:** `multipart/form-data`
  - **Form Fields:**
    - `videoFile`: The video file itself.
    - `title`: String
    - `publisher`: String (optional)
    - `producer`: String (optional)
    - `genre`: String (optional)
    - `ageRating`: String (optional)
  - **Response (Success):** `201 Created` - `{ "message": "Video uploaded successfully", "blobUrl": "url_to_blob" }`
  - **Response (Error):** `401 Unauthorized`, `403 Forbidden` (Not a creator), `500 Internal Server Error`

### Comments

- **`POST /api/videos/:id/comments`**
  - **Description:** Adds a comment to a specific video.
  - **Authentication:** JWT Token required (`Authorization: Bearer <token>`).
  - **Request Body:** `{ "comment": "string" }`
  - **Response (Success):** `201 Created` - `{ "message": "Comment added successfully" }`
  - **Response (Error):** `401 Unauthorized`, `500 Internal Server Error`

### Ratings

- **`POST /api/videos/:id/ratings`**
  - **Description:** Adds or updates a rating for a specific video by the authenticated user.
  - **Authentication:** JWT Token required (`Authorization: Bearer <token>`).
  - **Request Body:** `{ "rating": number }` (must be between 1 and 5)
  - **Response (Success):** `201 Created` - `{ "message": "Rating submitted successfully" }`
  - **Response (Error):** `400 Bad Request` (Invalid rating), `401 Unauthorized`, `500 Internal Server Error`

### Search

- **`GET /api/search`**
  - **Description:** Searches for videos based on a query string matching title, publisher, producer, or genre.
  - **Authentication:** None required.
  - **Query Parameter:** `q` (e.g., `/api/search?q=action`)
  - **Response (Success):** `200 OK` - `[ { "id": number, "title": "string", ..., "uploaderName": "string" }, ... ]` (List of matching videos)
  - **Response (Error):** `500 Internal Server Error`

## Database Schema (Conceptual)

- **Users**
  - `id` (PK, int, identity)
  - `username` (varchar, unique)
  - `password` (varchar) - **Note:** Store hashed passwords in production!
  - `role` (varchar, e.g., 'consumer', 'creator')
- **Videos**
  - `id` (PK, int, identity)
  - `title` (varchar)
  - `publisher` (varchar, nullable)
  - `producer` (varchar, nullable)
  - `genre` (varchar, nullable)
  - `ageRating` (varchar, nullable)
  - `blobUrl` (varchar)
  - `uploaderId` (FK -> Users.id, int)
  - `uploadDate` (datetime, default GETDATE())
- **Comments**
  - `id` (PK, int, identity)
  - `videoId` (FK -> Videos.id, int)
  - `userId` (FK -> Users.id, int)
  - `comment` (text or varchar(max))
  - `createdAt` (datetime, default GETDATE())
- **Ratings**
  - `id` (PK, int, identity)
  - `videoId` (FK -> Videos.id, int)
  - `userId` (FK -> Users.id, int)
  - `rating` (int)
  - (Consider adding a unique constraint on `videoId` and `userId`)

## Notes & Considerations

- **Password Security:** The current implementation stores passwords in plain text. **This is insecure.** Use a library like `bcryptjs` to hash passwords during registration and compare hashes during login.
- **Error Handling:** Error handling can be improved with more specific error messages and potentially a centralized error handling middleware.
- **Input Validation:** Add robust input validation (e.g., using `express-validator`) to check request bodies and parameters.
- **Admin Authentication:** The `/api/admin/create-creator` endpoint needs proper authentication/authorization to ensure only admins can use it.
- **SQL Injection:** Using parameterized queries (as done with `tedious`) helps prevent SQL injection, which is good.
- **Connection Pooling:** For better performance under load, consider implementing connection pooling for the database connections instead of creating a new connection for each request.

````

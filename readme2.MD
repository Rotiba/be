summary of all the API endpoints in your codebase, categorized by functionality, along with details on how they are accessed:

---

## **Authentication Endpoints**

### 1. **Login**

- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticates a user and returns a JWT token.
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  - Success: `200 OK` with a JWT token and user details.
  - Failure: `401 Unauthorized` or `500 Internal Server Error`.

---

### 2. **Register**

- **Endpoint:** `POST /api/auth/register`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string",
    "role": "string" // Optional, defaults to "consumer"
  }
  ```
- **Response:**
  - Success: `201 Created` with a success message.
  - Failure: `400 Bad Request` or `500 Internal Server Error`.

---

## **Video Endpoints**

### 3. **Get All Videos**

- **Endpoint:** `GET /api/videos`
- **Description:** Fetches all videos with uploader information.
- **Response:**
  - Success: `200 OK` with a list of videos.
  - Failure: `500 Internal Server Error`.

---

### 4. **Get Video by ID**

- **Endpoint:** `GET /api/videos/:id`
- **Description:** Fetches a specific video by its ID, including comments and average ratings.
- **Response:**
  - Success: `200 OK` with video details.
  - Failure: `404 Not Found` or `500 Internal Server Error`.

---

### 5. **Upload Video (Creators Only)**

- **Endpoint:** `POST /api/videos`
- **Description:** Allows creators to upload a video.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Body (Form Data):**
  - `videoFile` (file): The video file to upload.
  - `title`, `publisher`, `producer`, `genre`, `ageRating` (optional strings).
- **Response:**
  - Success: `201 Created` with a success message and blob URL.
  - Failure: `403 Forbidden` or `500 Internal Server Error`.

---

## **Comment Endpoints**

### 6. **Add Comment to Video**

- **Endpoint:** `POST /api/videos/:id/comments`
- **Description:** Adds a comment to a specific video.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "comment": "string"
  }
  ```
- **Response:**
  - Success: `201 Created` with a success message.
  - Failure: `500 Internal Server Error`.

---

### 7. **Get Comments for a Video**

- **Endpoint:** `GET /api/videos/:id/comments`
- **Description:** Fetches all comments for a specific video.
- **Response:**
  - Success: `200 OK` with a list of comments.
  - Failure: `500 Internal Server Error`.

---

## **Rating Endpoints**

### 8. **Rate a Video**

- **Endpoint:** `POST /api/videos/:id/ratings`
- **Description:** Adds or updates a rating for a specific video.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "rating": 1 // Integer between 1 and 5
  }
  ```
- **Response:**
  - Success: `201 Created` with a success message.
  - Failure: `400 Bad Request` or `500 Internal Server Error`.

---

### 9. **Get Ratings for a Video**

- **Endpoint:** `GET /api/videos/:id/ratings`
- **Description:** Fetches the average rating and rating count for a specific video.
- **Response:**
  - Success: `200 OK` with average rating and rating count.
  - Failure: `500 Internal Server Error`.

---

## **Search Endpoint**

### 10. **Search Videos**

- **Endpoint:** `GET /api/search`
- **Description:** Searches for videos by title, publisher, producer, or genre.
- **Query Parameters:**
  - `q`: The search query string.
- **Response:**
  - Success: `200 OK` with a list of matching videos.
  - Failure: `500 Internal Server Error`.

---

## **Summary of API Endpoints**

| **Method** | **Endpoint**               | **Description**                               | **Authentication** |
| ---------- | -------------------------- | --------------------------------------------- | ------------------ |
| `POST`     | `/api/auth/login`          | Authenticates a user and returns a JWT token. | No                 |
| `POST`     | `/api/auth/register`       | Registers a new user.                         | No                 |
| `GET`      | `/api/videos`              | Fetches all videos.                           | No                 |
| `GET`      | `/api/videos/:id`          | Fetches a specific video by ID.               | No                 |
| `POST`     | `/api/videos`              | Uploads a video (creators only).              | Yes                |
| `POST`     | `/api/videos/:id/comments` | Adds a comment to a video.                    | Yes                |
| `GET`      | `/api/videos/:id/comments` | Fetches all comments for a video.             | No                 |
| `POST`     | `/api/videos/:id/ratings`  | Adds or updates a rating for a video.         | Yes                |
| `GET`      | `/api/videos/:id/ratings`  | Fetches average rating and rating count.      | No                 |
| `GET`      | `/api/search`              | Searches for videos by query.                 | No                 |

---

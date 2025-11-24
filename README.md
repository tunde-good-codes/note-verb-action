# Notes-Verb-Action App (Microservices Architecture)

A production-ready **TypeScript + Express + MongoDB microservices application** that allows authenticated users to create and manage personal notes with tagging, role-based access control, and modular service communication. The system is designed for scalability, maintainability, and cloud deployment.

---

## 🧩 Architecture Overview

The Notes-Verb application is built using a **microservices architecture**, where every major domain feature is isolated into its own service:

| Service          | Responsibility                                                      |
| ---------------- | ------------------------------------------------------------------- |
| **Auth Service** | User authentication, authorization, token issuing, password hashing |
| **User Service** | User management, profiles, role control, data access                |
| **Note Service** | Creating, updating, deleting, and retrieving user notes             |
| **Tag Service**  | Managing tags and linking them to user notes                        |
| **API Gateway**  | Central entry point using HTTP proxy middleware to route API calls  |

All services communicate over HTTP through the **API Gateway**, keeping external clients unaware of backend internal structure.

---

## 🚀 Features

### ✔ Authentication & Security

* JWT-based authentication
* Argon2 password hashing
* Protected routes & middleware
* Role-based access (admin, user, etc.)

### ✔ Notes Management

Users can:

* Create notes
* Update notes
* Delete (soft delete) notes
* Filter notes by tags
* Store rich text content
* Version and modification timestamps

### ✔ Tags System

* Users can create tags
* Assign tags to notes
* Each user can only use their own tags
* Enforced unique tag naming per user

### ✔ API Gateway

* Single entry route for mobile or web apps
* Reverse proxy routing using:

  * `http-proxy-middleware` or `express-http-proxy`
* Ideal for deployment or hosting behind a load balancer

### ✔ Developer-Oriented

* Modular folder setup
* Centralized logging
* MVC + service layers
* Validation using Joi
* Production-ready scripts

---

## 🛠 Tech Stack

### Backend

* **Node.js**
* **Express**
* **TypeScript**
* **MongoDB + Mongoose**
* **Joi** for validation
* **JWT** for authentication
* **Winston** logging

### Infrastructure

* **Microservices** pattern
* **HTTP Proxy Gateway**
* **Service isolation**

### Dev Tools

* Nodemon
* ts-node
* Jest (planned)
* EJS for templated emails

---

## 📁 Folder Structure

A typical structure looks like:

```
notes-verb-app/
 ├── apps/
 │    ├── auth-service/
 │    ├── user-service/
 │    ├── note-service/
 │    ├── tag-service/
 │    └── api-gateway/
 ├── package.json
 ├── README.md
 └── ...
```



---

## ⚙ Running Locally

### 1️⃣ Install Dependencies

From project root:

```
npm install
```

### 2️⃣ Start All Services

You can start individual services from their folders:

```
npm run dev
```

Or using a central concurrent setup if configured:

```
npm run dev:all
```

### 3️⃣ Environment Variables

Each service needs a `.env` file:

```
DATABASE_URL=
JWT_SECRET=
PORT=
```

Auth service also needs:

```
TOKEN_EXPIRES_IN=
```

---

## 🔗 API Gateway

Clients do **not** communicate with services directly.

Example:

```
POST /api/auth/login
POST /api/notes/create
GET  /api/tags
```

The gateway routes them:

```
/auth  → auth-service
/notes → note-service
/tags  → tag-service
```

---


Nigeria

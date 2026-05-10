# 📝 MERN Blog Application

A simple full-stack blog app built with **MongoDB, Express, React, and Node.js**.

---

## 📁 Project Structure

```
BLOG APPLICATION/
├── backend/
│   ├── models/
│   │   └── Post.js          # Mongoose schema
│   ├── routes/
│   │   └── posts.js         # REST API routes
│   ├── server.js            # Express server entry point
│   ├── .env                 # MongoDB connection string (you must fill this)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.js            # All React logic (form + post list)
    │   └── App.css           # Basic styles
    └── package.json
```

---

## ⚙️ Setup & Run Locally

### Step 1: Configure MongoDB

Open `backend/.env` and replace the placeholder with your real MongoDB Atlas URI.

> Get your URI from: [MongoDB Atlas](https://cloud.mongodb.com) → your cluster → **Connect** → **Drivers**  
> Make sure to **whitelist your IP** in Atlas Network Access.

---

### Step 2: Start the Backend

```bash
cd backend
npm install     
npm start
```

Server runs at: `http://localhost:5000`

---

### Step 3: Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm start
```

React app runs at: `http://localhost:3000`

---

## 🚀 API Endpoints

| Method | Route         | Description         |
|--------|---------------|---------------------|
| GET    | /posts        | Get all blog posts  |
| POST   | /posts        | Create a new post   |
| DELETE | /posts/:id    | Delete a post by ID |

**POST /posts body (JSON):**
```json
{
  "title": "My First Post",
  "content": "Hello World!"
}
```

---

## 🧰 Tech Stack

- **Frontend**: React (Create React App)
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas (via Mongoose)
- **CORS**: Enabled for cross-origin requests

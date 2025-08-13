# Hypertrophy Tracker — Backend

This is the backend API for the Hypertrophy Tracker app.  
For the frontend, visit: [Hypertrophy Tracker Frontend](https://github.com/emraany/hypertrophy-tracker-frontend)

---

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication

---

##  Setup

### Environment Variables
Create a `.env` file in the root:

```
env
PORT=5000
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET=<your secret>
CLIENT_URL=https://your-frontend.vercel.app
```

### Installation
```
bash
cd hypertrophy-tracker-backend
npm install
npm start
```

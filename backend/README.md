# Railway Deployment Guide (Working Setup)

This document summarizes how we successfully deployed a full-stack (React + Node.js) application to **Railway**, including fixes for common issues encountered during deployment.

---

## 1. Fixing the Start Command (Railway Couldn’t Start the App)

**Issue:**  
Railway failed to start the application with the error:
```
Script start.sh not found
No start command was found
```

**Solution:**  
Railway expects a valid start command at the root.

We added a **root `package.json`** with the following scripts:
```json
{
  "start": "cd backend && npm start",
  "build": "cd frontend && npm run build"
}
```

Additionally, we created a simple `start.sh` file:
```sh
cd backend && npm start
```

This satisfies Railpack’s expectations and allows Railway to start the app correctly.

---

## 2. Ensuring Dependencies Install for Both Backend and Frontend

**Issue:**  
Railway only runs `npm install` at the root.  
This caused frontend dependencies (e.g. Vite) not to install, resulting in:
```
sh: 1: vite: not found
```

**Solution:**  
We added a `postinstall` script in the root `package.json`:
```json
{
  "postinstall": "cd backend && npm install && cd ../frontend && npm install"
}
```

Now, when Railway runs `npm install`, dependencies for **both backend and frontend** are installed automatically.

---

## 3. Getting Environment Variables Working in Railway

**Issue:**  
The backend crashed with:
```
Missing MONGODB_URI
```
even though environment variables were set in Railway.

Debugging `process.env` showed only `PORT` and `RAILWAY_*` variables—custom variables were missing.

**Root Causes & Fixes:**
- Environment variables must be set **at the Service level**, not just the Project level.
- Variables were configured under **Service → Production Environment**:
  - `MONGODB_URI`
  - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - `GOOGLE_PRIVATE_KEY`
  - `GOOGLE_SHEETS_SCOPES`
  - `ALLOWED_ORIGIN`
- Updated `backend/src/index.js` to load `.env` **only if present**, ensuring Railway-injected variables are not overridden.

---

## 4. Connecting to MongoDB Atlas from Railway

**Issue:**  
Even after `MONGODB_URI` was detected, MongoDB failed to connect:
```
Could not connect to any servers in your MongoDB Atlas cluster
IP address is not whitelisted
```

**Solution:**  
In **MongoDB Atlas → Network Access**, we:
- Allowed access from `0.0.0.0/0` (to support Railway’s dynamic IPs)

After this change, logs confirmed:
```
MongoDB connected successfully
```

---

## 5. Serving the React Frontend from the Backend

**Issue:**  
Visiting the Railway URL returned:
```
Cannot GET /
```
because only the backend API was exposed.

**Solution:**
- Kept the root build script:
  ```json
  "build": "cd frontend && npm run build"
  ```
- This builds the React app into `frontend/dist`
- Updated `backend/src/index.js` to:
  - Serve static files using `express.static('../frontend/dist')`
  - For all non-API routes (`app.get('*')`), return `dist/index.html`
- Updated the frontend Axios client to use a **relative base URL (`''`)**, so API calls go to the same origin.

---

## 6. Final Checks & Verification

- Confirmed backend listens on `process.env.PORT` (provided by Railway)
- Verified logs:
  ```
  🚀 Backend server running on port 8080
  ✅ MongoDB connected successfully
  ```
- Confirmed:
  - React UI loads from the Railway URL
  - Data ingestion works
  - Data is stored in MongoDB Atlas
  - CSV download endpoints function correctly

---

## Summary

In short, the deployment worked because we:
- Added proper root `start` and `build` scripts
- Ensured dependencies install for both backend and frontend
- Correctly configured and consumed Railway environment variables
- Opened MongoDB Atlas access for Railway
- Wired the backend to serve the built React frontend

Together, these changes resulted in a fully functional Railway deployment.

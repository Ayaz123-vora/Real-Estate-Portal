# Real Estate Portal

A full-stack property marketplace built with React and Vite on the frontend, and Express, Node.js, and MongoDB on the backend. Visitors can browse and filter listings, while registered users and agents can manage listings and inquiries. Administrators can review listings.

## Features

- Browse featured and approved properties, view property details, and search or filter listings.
- Register and sign in as a user or agent; authenticated users can save properties and manage listings through the dashboard.
- Submit and manage inquiries about properties.
- Upload listing images; the API accepts up to eight image files per listing, each up to 10 MB.
- Admin dashboard tools for property approval and platform statistics.

## Requirements

- Node.js and npm
- MongoDB, running locally or available through a MongoDB connection URI

## Setup

Open two terminals from the project root.

### Backend

```sh
cd backend
npm install
```

Create `backend/.env` based on `backend/.env.example` and set the MongoDB URI and a private JWT secret:

```env
MONGODB_URI=mongodb://localhost:27017/realestate_portal_db
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
```

Start the API:

```sh
npm run dev
```

Use `npm start` to run it without nodemon.

### Frontend

In the second terminal:

```sh
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Vite proxies API and uploaded-image requests to `http://localhost:5000`.

## Sample Data

To populate MongoDB with sample listings and demo accounts, stop the backend and run this from the `backend` directory:

```sh
node seed.js
```

**Warning:** Seeding deletes all existing users, properties, and inquiries in the configured database before adding the sample data. Use a development database only.

Demo accounts created by the seed script:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@realestate.com` | `adminpassword123` |
| Agent | `john.realty@realestate.com` | `agentpassword123` |
| Agent | `sarah.villas@realestate.com` | `agentpassword123` |
| User | `user@realestate.com` | `userpassword123` |

## Useful Commands

Run these from `frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3000 |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run Oxlint |

Run these from `backend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with nodemon |
| `npm start` | Start the API with Node.js |
| `node seed.js` | Clear and repopulate the configured database with demo data |

## API Overview

The backend listens on port 5000 by default. `GET /` is a health check.

| Prefix | Purpose |
| --- | --- |
| `/api/auth` | Registration, login, and profile management |
| `/api/properties` | Property search, details, listing management, and saved properties |
| `/api/inquiries` | Submit and manage property inquiries |
| `/api/admin` | Admin property review and platform statistics |
| `/uploads` | Uploaded listing images |

## Project Structure

```text
backend/   Express API, MongoDB models, routes, and uploads
frontend/  React application, pages, components, and Vite configuration
```
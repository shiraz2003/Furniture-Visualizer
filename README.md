# Furniture Visualizer  
**PUSL3122 – HCI, Computer Graphics, and Visualisation (25/SP/M)**

Furniture Visualizer is a full‑stack web application that lets users design a room layout and visualize furniture in **2D and 3D**. It includes user authentication (including Google OAuth), an admin panel to manage users/items/orders/reviews, and APIs for furniture, orders, saved designs, and reviews.

---

## Tech Stack

### Frontend (`/client`)
- **React + Vite**
- **React Router**
- **Three.js** (3D rendering)
- **Tailwind CSS**
- **Axios**
- **Google OAuth** (`@react-oauth/google`)
- **Supabase client** (`@supabase/supabase-js`) *(used by the client as a dependency)*

### Backend (`/server`)
- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT Authentication** (`jsonwebtoken`)
- **Password Hashing** (`bcryptjs`)
- **File Uploads** (`multer`)
- **Email** (`nodemailer`)
- **CORS / Logging** (`cors`, `morgan`)
- **dotenv** for environment variables

---

## Main Features

### User Features
- User login & registration
- Google OAuth login
- Dashboard
- Room setup
- **2D Editor**
- **3D Viewer**
- Furniture browsing and furniture details pages
- Cart page
- Profile page
- Saved designs
- Reviews page

### Admin Features (Protected)
- Admin dashboard
- Manage users
- Manage furniture/items
- Manage orders
- Manage reviews

---

## Project Structure

```text
Furniture-Visualizer/
├─ client/                  # React (Vite) frontend
│  ├─ src/
│  │  ├─ pages/             # App pages (Login, Dashboard, Viewer3D, etc.)
│  │  ├─ components/        # Shared components (ProtectedRoute, etc.)
│  │  ├─ context/           # Context providers (DesignContext)
│  │  ├─ admin/             # Admin UI (users/items/orders/reviews)
│  │  ├─ services/          # API helpers
│  │  └─ utils/
│  └─ public/
└─ server/                  # Express backend
   └─ src/
      ├─ routes/            # auth, orders, designs, reviews, admin routes
      ├─ controllers/
      ├─ models/
      ├─ middleware/
      └─ uploads/           # uploaded assets (served as static)
```

---

## API Overview (Backend)

The backend mounts these route groups:

- `POST/GET /api/auth/...` – authentication routes  
- `/api/admin/...` – admin routes (users, orders, admin operations)  
- `/api/furniture/...` – furniture/item routes  
- `/api/designs/...` – saved design routes  
- `/api/reviews/...` – review routes  
- `/uploads/...` – serves uploaded files publicly (e.g., 3D assets like `.glb` files)

> The backend is configured to allow requests from local Vite ports (5173/5174/5175), `localhost:3000`, and a deployed Vercel frontend.

---

## Getting Started (Local Development)

### Prerequisites
- **Node.js** (LTS recommended)
- **npm**
- A **MongoDB** instance (local MongoDB or MongoDB Atlas)

### 1) Clone the repository
```bash
git clone https://github.com/shiraz2003/Furniture-Visualizer.git
cd Furniture-Visualizer
```

### 2) Install dependencies (root + client + server)
```bash
npm run install-all
```

### 3) Environment Variables

Create a `.env` file inside the **server** folder (`server/.env`) and configure:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=fill_yours
CLIENT_ORIGIN=your_origin

EMAIL_USER=furniture12345store@gmail.com
EMAIL_PASSWORD=your_apppassword

PAYPAL_CLIENT_ID=your_clientID
PAYPAL_SECRET=Your_PAYPAL_SANDBOX_secret
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
```

Create a `.env` file inside the **client** folder (`client/.env`) and configure:

```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_BACKEND_URL=your_url
VITE_GOOGLE_CLIENT_ID=your_googleclient_id
VITE_GOOGLE_CLIENT_SECRET=your_googleclient_secret
```

*(You may need additional variables depending on how features like email/Supabase are used in your implementation.)*

---

## Running the Project

### Run both frontend + backend together (recommended)
From the project root:

```bash
npm run dev
```

This runs:
- backend via `npm run server` (inside `/server`)
- frontend via `npm run client` (inside `/client`)

### Run separately (optional)

**Backend**
```bash
npm run server
```

**Frontend**
```bash
npm run client
```

---

## Available Scripts

### Root (`/package.json`)
- `npm run install-all` – install dependencies for root, client, and server
- `npm run dev` – run server + client concurrently
- `npm run server` – run backend dev server
- `npm run client` – run frontend dev server

### Client (`/client/package.json`)
- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview build output
- `npm run lint` – run ESLint

### Server (`/server/package.json`)
- `npm run dev` – run server with nodemon
- `npm start` – run server normally

---

## Notes
- Uploaded files are served from `server/src/uploads` through the `/uploads` static endpoint.
- Admin routes are protected and require an admin role through the `ProtectedRoute` logic in the frontend.

---

## License
This project is provided for academic/coursework purposes under **PUSL3122**.

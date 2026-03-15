# EventSphere - Full Stack Event Booking Platform

## 🚀 Setup Instructions

This guide will help you set up and run the EventSphere application locally.

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally or a remote URI)

### 1. Database Setup
1. Open PostgreSQL and create a database named `eventsphere`:
   ```sql
   CREATE DATABASE eventsphere;
   ```

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the `server` folder by copying the example:
   ```bash
   cp .env.example .env
   ```
   Update the `DATABASE_URL` in your `.env` to match your Postgres credentials.

4. Run Prisma Migrations to create tables:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *(Server starts on `http://localhost:5000`)*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(Frontend usually starts on `http://localhost:5173`)*

---

## 🔑 Sample Test Data

### Admin User Account
Create an Admin account first to test the event creation.
- Go to Sign Up: `http://localhost:5173/register`
- **Role:** Select "Admin"
- **Email:** `admin@eventsphere.com`
- **Password:** `password123`

### Sample Events to Create (Admin Panel)

**1. Summer Music Festival**
- Date: Select a date next month
- Price: 150.00
- Location: Central Park, New York
- Image URL: `https://images.unsplash.com/photo-1540039155732-680c74f5147e?auto=format&fit=crop&q=80&w=2000`
- Description: Join us for the biggest summer music festival featuring top artists from around the world. A weekend of unforgettable performances!

**2. Tech Innovators Conference**
- Date: Select a date in 2 weeks
- Price: 299.99
- Location: Moscone Center, San Francisco
- Image URL: `https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=2000`
- Description: Learn from industry leaders, discover new technologies, and network with professionals at this annual tech conference.

**3. Food & Wine Expo**
- Date: Select a date this weekend
- Price: 75.00
- Location: Convention Center, Chicago
- Image URL: `https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=2000`
- Description: Taste exquisite dishes and sample the finest wines. A weekend of unforgettable culinary experiences!

### Regular User Account
- Sign up normally as a "User"
- **Email:** `user@example.com`
- **Password:** `password123`
- *Test booking an event and viewing it in My Bookings!*

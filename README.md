# Flight Booking Application

A full-stack flight booking application built with MERN stack (MongoDB, Express.js, React.js, Node.js) with JWT authentication.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes for authenticated users
- Role-based access control (Admin vs User)

### Flight Management (Admin)
- Create new flights
- View all flights
- Update flight details
- Delete flights

### Flight Booking (Users)
- Search flights by origin, destination, and date
- Support for One Way, Round Trip, and Multi City trips
- Book flights with passenger details
- View all bookings
- Cancel or delete bookings

### UI Features
- Modern and responsive design
- Flight search interface matching professional booking sites
- Trip type selector (One Way, Round Trip, Multi City)
- Date picker for flight dates
- Currency selector
- Passenger management

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React.js** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **React DatePicker** - Date selection
- **React Icons** - Icons

## Project Structure

```
flight booking/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Flight.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── flights.js
│   │   └── bookings.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── FlightSearch.js
│   │   │   ├── BookFlight.js
│   │   │   ├── MyBookings.js
│   │   │   └── AdminPanel.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── styles/
│   │   │   ├── Navbar.css
│   │   │   ├── Home.css
│   │   │   ├── Auth.css
│   │   │   ├── FlightSearch.css
│   │   │   ├── BookFlight.css
│   │   │   ├── MyBookings.css
│   │   │   └── AdminPanel.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Step 1: Install MongoDB

**Option A: Local MongoDB Installation**
1. Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - Windows: MongoDB should start automatically as a service
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string

### Step 2: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
# Copy the example file
# On Windows: copy .env.example .env
# On Mac/Linux: cp .env.example .env
```

4. Edit the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/flightbooking
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flightbooking

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Start the backend server:
```bash
npm start
# OR for development with auto-reload:
npm run dev
```

The backend server will run on `http://localhost:5000`

### Step 3: Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will automatically open in your browser at `http://localhost:3000`

### Step 4: Create Admin User (Optional)

To create an admin user, you can either:

**Option A: Use MongoDB Compass or mongo shell:**
1. Connect to your MongoDB database
2. Navigate to the `users` collection
3. Insert a user document and manually set `role: 'admin'`:
```javascript
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "$2a$10$...", // Hashed password
  "role": "admin"
}
```

**Option B: Use the registration endpoint and manually update the database:**
1. Register a user through the frontend
2. Find the user in MongoDB and update `role` to `'admin'`

**Option C: Create a seed script (recommended):**

Create a file `backend/seedAdmin.js`:
```javascript
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    
    console.log('Admin user created:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
```

Then run:
```bash
node seedAdmin.js
```

## Usage

### For Regular Users:
1. **Register/Login**: Create an account or login
2. **Search Flights**: Use the search page to find flights
3. **Book Flights**: Click "Book Now" on any available flight
4. **View Bookings**: Check "My Bookings" to see all your bookings
5. **Cancel Bookings**: Cancel or delete bookings from "My Bookings"

### For Admins:
1. **Login**: Login with admin credentials
2. **Admin Panel**: Access the "Admin Panel" from the navigation
3. **Add Flights**: Click "Add New Flight" to create flights
4. **Edit Flights**: Click "Edit" on any flight to update details
5. **Delete Flights**: Click "Delete" to remove flights

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Flights
- `GET /api/flights` - Get all flights (with search params)
- `GET /api/flights/:id` - Get single flight
- `POST /api/flights` - Create flight (Admin only)
- `PUT /api/flights/:id` - Update flight (Admin only)
- `DELETE /api/flights/:id` - Delete flight (Admin only)

### Bookings
- `GET /api/bookings` - Get user's bookings (Protected)
- `GET /api/bookings/:id` - Get single booking (Protected)
- `POST /api/bookings` - Create booking (Protected)
- `PUT /api/bookings/:id` - Update booking (Cancel) (Protected)
- `DELETE /api/bookings/:id` - Delete booking (Protected)

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT expiration time (default: 7d)
- `NODE_ENV` - Environment (development/production)

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: React will automatically use the next available port

### CORS Issues
- Make sure the backend CORS is configured correctly
- Check that frontend proxy in `package.json` points to correct backend URL

### Authentication Issues
- Clear browser localStorage if having token issues
- Check JWT_SECRET is set in backend `.env`

## Production Deployment

### Backend:
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Use MongoDB Atlas or a managed MongoDB service
4. Deploy to platforms like Heroku, Railway, or AWS

### Frontend:
1. Build the production bundle: `npm run build`
2. Serve the `build` folder using a web server (nginx, Apache, etc.)
3. Deploy to platforms like Vercel, Netlify, or AWS S3

## License

This project is for educational purposes.

## Notes

- The default admin credentials (if using seed script): `admin@example.com` / `admin123`
- Remember to change default passwords in production
- Flight search supports filtering by origin, destination, and departure date
- Multi-city booking is supported in the UI (backend supports it via returnFlight field)

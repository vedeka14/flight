# Quick Setup Guide

Follow these steps to run the Flight Booking Application:

## Step 1: Install MongoDB

### Windows:
1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Install it with default settings
3. MongoDB will start automatically as a Windows service

### Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Alternative: MongoDB Atlas (Cloud - No installation needed)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string

## Step 2: Backend Setup

1. **Open terminal in project root and navigate to backend:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
   - Copy `.env.example` to `.env` (or create new file)
   - Windows: `copy .env.example .env`
   - Mac/Linux: `cp .env.example .env`

4. **Edit .env file:**
   - Set `MONGODB_URI` to your MongoDB connection string
   - For local MongoDB: `mongodb://localhost:27017/flightbooking`
   - For MongoDB Atlas: use your connection string from step 1

5. **Start backend server:**
```bash
npm start
```

Backend will run on http://localhost:5000

## Step 3: Frontend Setup

1. **Open a NEW terminal and navigate to frontend:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start React app:**
```bash
npm start
```

Frontend will open automatically at http://localhost:3000

## Step 4: Create Admin User (Optional)

1. **In backend terminal, run:**
```bash
node seedAdmin.js
```

This creates an admin user:
- Email: `admin@example.com`
- Password: `admin123`

2. **Login with these credentials to access Admin Panel**

## Step 5: Start Using the App

1. **Register/Login**: Create your account or login
2. **Search Flights**: Go to Search Flights page
3. **Book Flight**: Click "Book Now" on any flight
4. **View Bookings**: Check "My Bookings" to see your bookings
5. **Admin Panel**: Login as admin to manage flights

## Troubleshooting

### MongoDB not connecting?
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env` file
- For MongoDB Atlas: Whitelist your IP address

### Port already in use?
- Backend: Change `PORT` in `.env` file
- Frontend: React will ask to use different port

### Cannot find module errors?
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### CORS errors?
- Make sure backend is running on port 5000
- Check frontend `package.json` has correct proxy

## That's it! Your app should be running now! 🚀

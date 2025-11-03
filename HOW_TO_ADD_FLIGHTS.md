# How to Add Sample Flights

## Quick Steps

### Option 1: Using the Script (Easiest)

1. **Make sure MongoDB is running**
   - If using local MongoDB, make sure the service is started
   - If using MongoDB Atlas, make sure your connection string is correct

2. **Check your .env file**
   - Navigate to `backend` folder
   - Make sure you have a `.env` file with `MONGODB_URI`
   - If not, copy `env.example` to `.env` and edit it

3. **Navigate to backend directory**
   ```bash
   cd backend
   ```

4. **Run the script**
   ```bash
   node examples/addFlights.js
   ```

5. **That's it!** The script will add 6 sample flights to your database.

---

### Option 2: Using Admin Panel (User Interface)

1. **Start the backend server** (if not running)
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend server** (if not running)
   ```bash
   cd frontend
   npm start
   ```

3. **Login as Admin**
   - Go to http://localhost:3000
   - Login with admin credentials
   - Default: `admin@example.com` / `admin123`
   - (If admin doesn't exist, run `node seedAdmin.js` first)

4. **Go to Admin Panel**
   - Click "Admin Panel" in the navigation bar
   - Or go directly to: http://localhost:3000/admin

5. **Add Flight**
   - Click "Add New Flight" button
   - Fill in the form:
     - Flight Number (e.g., "AI101")
     - Airline (e.g., "Air India")
     - Origin (e.g., "Delhi")
     - Destination (e.g., "Mumbai")
     - Departure Date & Time
     - Arrival Date & Time
     - Price (e.g., 5000)
     - Total Seats (e.g., 180)
     - Available Seats (e.g., 150)
   - Click "Create Flight"

---

## Detailed Instructions

### Step 1: Check MongoDB Connection

The script needs to connect to MongoDB. Make sure:

**For Local MongoDB:**
- MongoDB service is running
- Your `.env` file has: `MONGODB_URI=mongodb://localhost:27017/flightbooking`

**For MongoDB Atlas:**
- Your `.env` file has your Atlas connection string
- Example: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flightbooking`

### Step 2: Navigate to Backend

Open terminal/command prompt and:
```bash
cd backend
```

### Step 3: Run the Script

```bash
node examples/addFlights.js
```

**Expected Output:**
```
Connected to MongoDB
✓ Added flight: AI101 - Delhi to Mumbai
✓ Added flight: SG202 - Mumbai to Bangalore
✓ Added flight: IG303 - Delhi to Kolkata
✓ Added flight: 6E404 - Mumbai to Delhi
✓ Added flight: UK505 - Delhi to Chennai
✓ Added flight: AI606 - Bangalore to Delhi

✅ Success! Added 6 flights, skipped 0 duplicates.
```

### Step 4: Verify Flights Added

**Option A: Check via Frontend**
- Go to http://localhost:3000/search
- Try searching for flights (e.g., Delhi to Mumbai)

**Option B: Check via API**
- Open browser: http://localhost:5000/api/flights
- Should see JSON with flights array

**Option C: Check via Admin Panel**
- Login as admin
- Go to Admin Panel
- Should see list of all flights

---

## Troubleshooting

### Error: "Cannot find module"
```bash
# Make sure you're in the backend directory
cd backend

# Install dependencies if needed
npm install
```

### Error: "MongoDB connection failed"
- Check if MongoDB is running
- Verify `.env` file has correct `MONGODB_URI`
- For MongoDB Atlas: Check if IP is whitelisted

### Error: "Flight already exists"
- This is normal if you run the script multiple times
- The script skips flights that already exist
- To add duplicates, first delete existing flights via Admin Panel

### Script adds 0 flights
- Check if MongoDB connection is working
- Make sure you're in the `backend` directory when running
- Check console for error messages

---

## Sample Flights That Will Be Added

1. **AI101** - Air India: Delhi → Mumbai (₹5,000)
2. **SG202** - SpiceJet: Mumbai → Bangalore (₹3,500)
3. **IG303** - IndiGo: Delhi → Kolkata (₹4,500)
4. **6E404** - IndiGo: Mumbai → Delhi (₹4,200)
5. **UK505** - Vistara: Delhi → Chennai (₹6,000)
6. **AI606** - Air India: Bangalore → Delhi (₹5,500)

---

## Quick Command Reference

```bash
# Navigate to backend
cd backend

# Run the script
node examples/addFlights.js

# Or if you prefer npm script (you can add this to package.json)
npm run seed-flights
```

---

## Alternative: Add Flights Manually via API

If you prefer using API calls (Postman, cURL, etc.), see `API_DOCUMENTATION.md` for details.


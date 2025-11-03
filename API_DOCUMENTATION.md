# Flight Booking API Documentation

## Flight Management APIs

### 1. Create Flight (Add New Flight)

**Endpoint:** `POST /api/flights`

**Access:** Admin only (requires authentication token)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "flightNumber": "AI101",
  "airline": "Air India",
  "origin": "Delhi",
  "destination": "Mumbai",
  "departureDate": "2024-12-01T10:00:00.000Z",
  "arrivalDate": "2024-12-01T12:00:00.000Z",
  "departureTime": "10:00",
  "arrivalTime": "12:00",
  "price": 5000,
  "availableSeats": 150,
  "totalSeats": 180,
  "aircraft": "Boeing 737" // Optional
}
```

**Required Fields:**
- `flightNumber` (String, unique)
- `airline` (String)
- `origin` (String)
- `destination` (String)
- `departureDate` (Date/ISO string)
- `arrivalDate` (Date/ISO string)
- `departureTime` (String, format: "HH:MM")
- `arrivalTime` (String, format: "HH:MM")
- `price` (Number)
- `availableSeats` (Number, min: 0)
- `totalSeats` (Number, min: 1)

**Optional Fields:**
- `aircraft` (String)

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "flightNumber": "AI101",
  "airline": "Air India",
  "origin": "Delhi",
  "destination": "Mumbai",
  "departureDate": "2024-12-01T10:00:00.000Z",
  "arrivalDate": "2024-12-01T12:00:00.000Z",
  "departureTime": "10:00",
  "arrivalTime": "12:00",
  "price": 5000,
  "availableSeats": 150,
  "totalSeats": 180,
  "aircraft": "Boeing 737",
  "createdAt": "2024-11-01T10:00:00.000Z",
  "updatedAt": "2024-11-01T10:00:00.000Z"
}
```

**Error Response (400):**
```json
{
  "message": "Flight validation failed: flightNumber is required"
}
```

**Error Response (401):**
```json
{
  "message": "Not authorized, no token"
}
```

**Error Response (403):**
```json
{
  "message": "Access denied. Admin only."
}
```

---

### 2. Update Flight

**Endpoint:** `PUT /api/flights/:id`

**Access:** Admin only

**Example:**
```bash
PUT http://localhost:5000/api/flights/507f1f77bcf86cd799439011
```

**Request Body:** (Same as create, with fields to update)

---

### 3. Delete Flight

**Endpoint:** `DELETE /api/flights/:id`

**Access:** Admin only

**Example:**
```bash
DELETE http://localhost:5000/api/flights/507f1f77bcf86cd799439011
```

---

### 4. Get All Flights

**Endpoint:** `GET /api/flights`

**Access:** Public (no authentication required)

**Query Parameters:**
- `origin` (optional) - Filter by origin city
- `destination` (optional) - Filter by destination city
- `departureDate` (optional) - Filter by departure date (ISO string)
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Results per page

**Example:**
```
GET http://localhost:5000/api/flights?origin=Delhi&destination=Mumbai&page=1&limit=10
```

**Response:**
```json
{
  "flights": [...],
  "currentPage": 1,
  "totalPages": 5,
  "totalFlights": 50
}
```

---

### 5. Get Single Flight

**Endpoint:** `GET /api/flights/:id`

**Access:** Public

**Example:**
```
GET http://localhost:5000/api/flights/507f1f77bcf86cd799439011
```

---

## How to Use the API

### Method 1: Using the Admin Panel (Recommended)

1. **Login as Admin:**
   - Use the admin credentials (create with `node seedAdmin.js`)
   - Default: `admin@example.com` / `admin123`

2. **Navigate to Admin Panel:**
   - Click "Admin Panel" in the navigation bar
   - Or go to: `http://localhost:3000/admin`

3. **Add Flight:**
   - Click "Add New Flight" button
   - Fill in all required fields
   - Click "Create Flight"

### Method 2: Using cURL

```bash
# First, login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Save the token from response, then:
curl -X POST http://localhost:5000/api/flights \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "flightNumber": "AI101",
    "airline": "Air India",
    "origin": "Delhi",
    "destination": "Mumbai",
    "departureDate": "2024-12-01T10:00:00.000Z",
    "arrivalDate": "2024-12-01T12:00:00.000Z",
    "departureTime": "10:00",
    "arrivalTime": "12:00",
    "price": 5000,
    "availableSeats": 150,
    "totalSeats": 180
  }'
```

### Method 3: Using Postman/Insomnia

1. **Setup Request:**
   - Method: POST
   - URL: `http://localhost:5000/api/flights`
   - Headers:
     - `Content-Type: application/json`
     - `Authorization: Bearer <your_token>`
   - Body (JSON):
     ```json
     {
       "flightNumber": "AI101",
       "airline": "Air India",
       "origin": "Delhi",
       "destination": "Mumbai",
       "departureDate": "2024-12-01T10:00:00.000Z",
       "arrivalDate": "2024-12-01T12:00:00.000Z",
       "departureTime": "10:00",
       "arrivalTime": "12:00",
       "price": 5000,
       "availableSeats": 150,
       "totalSeats": 180
     }
     ```

### Method 4: Using JavaScript/Fetch

```javascript
// First login to get token
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'admin123'
  })
});

const { token } = await loginResponse.json();

// Then create flight
const flightResponse = await fetch('http://localhost:5000/api/flights', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    flightNumber: 'AI101',
    airline: 'Air India',
    origin: 'Delhi',
    destination: 'Mumbai',
    departureDate: new Date('2024-12-01T10:00:00Z'),
    arrivalDate: new Date('2024-12-01T12:00:00Z'),
    departureTime: '10:00',
    arrivalTime: '12:00',
    price: 5000,
    availableSeats: 150,
    totalSeats: 180
  })
});

const newFlight = await flightResponse.json();
console.log('Flight created:', newFlight);
```

---

## Example Flight Data

Here are some example flights you can add:

```json
[
  {
    "flightNumber": "AI101",
    "airline": "Air India",
    "origin": "Delhi",
    "destination": "Mumbai",
    "departureDate": "2024-12-15T08:00:00.000Z",
    "arrivalDate": "2024-12-15T10:00:00.000Z",
    "departureTime": "08:00",
    "arrivalTime": "10:00",
    "price": 5000,
    "availableSeats": 150,
    "totalSeats": 180
  },
  {
    "flightNumber": "SG202",
    "airline": "SpiceJet",
    "origin": "Mumbai",
    "destination": "Bangalore",
    "departureDate": "2024-12-15T14:00:00.000Z",
    "arrivalDate": "2024-12-15T16:00:00.000Z",
    "departureTime": "14:00",
    "arrivalTime": "16:00",
    "price": 3500,
    "availableSeats": 120,
    "totalSeats": 180
  },
  {
    "flightNumber": "IG303",
    "airline": "IndiGo",
    "origin": "Delhi",
    "destination": "Kolkata",
    "departureDate": "2024-12-16T09:00:00.000Z",
    "arrivalDate": "2024-12-16T11:00:00.000Z",
    "departureTime": "09:00",
    "arrivalTime": "11:00",
    "price": 4500,
    "availableSeats": 100,
    "totalSeats": 180
  }
]
```

---

## Important Notes

1. **Authentication Required:** You must be logged in as an admin to create/update/delete flights
2. **Unique Flight Numbers:** Each flight number must be unique
3. **Date Format:** Use ISO 8601 format for dates (YYYY-MM-DDTHH:mm:ss.sssZ)
4. **Time Format:** Use 24-hour format (HH:MM)
5. **Seats:** `availableSeats` cannot exceed `totalSeats`
6. **Price:** Must be a positive number

---

## Testing the API

You can test if the API is working:

```bash
# Check if server is running
curl http://localhost:5000/api/flights

# Should return JSON with flights array (might be empty if no flights added yet)
```


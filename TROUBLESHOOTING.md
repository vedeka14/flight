# Troubleshooting Guide

## Search Not Working

### Issue: No flights appear when searching

**Possible Causes & Solutions:**

1. **No flights in database**
   - Solution: Login as admin and add some flights through the Admin Panel
   - Make sure flights have matching origin/destination names

2. **Search fields not filled**
   - Solution: Make sure you enter both "From" (origin) and "To" (destination) fields
   - The search now validates these fields and will show an error if missing

3. **Case sensitivity or spelling**
   - Solution: The search uses case-insensitive matching, but make sure spelling matches
   - Example: "New York" vs "new york" both work, but "NewYork" might not match

4. **Backend not running**
   - Solution: Make sure backend is running on port 5000
   - Check: `http://localhost:5000/api/flights` should return JSON

5. **CORS issues**
   - Solution: Check browser console for CORS errors
   - Make sure frontend proxy in `package.json` points to `http://localhost:5000`

### To Test Search:
1. Open browser console (F12)
2. Try searching and check for errors
3. Check Network tab to see API calls
4. Verify API response contains flights array

## Booking Not Working

### Issue: Cannot book flights or booking fails

**Possible Causes & Solutions:**

1. **Not logged in**
   - Solution: Make sure you are logged in before booking
   - Try logging out and logging back in

2. **Invalid passenger data**
   - Solution: Make sure all passenger names and ages are filled
   - Ages must be between 1-120
   - Names cannot be empty or just spaces

3. **Flight not found or seats unavailable**
   - Solution: Try booking a different flight
   - Check if flight has available seats

4. **Authentication token expired**
   - Solution: Logout and login again
   - Check browser console for 401 errors

5. **Backend connection issue**
   - Solution: Make sure backend is running
   - Check: `http://localhost:5000/api/auth/me` (with auth token)

### To Debug Booking:
1. Open browser console (F12)
2. Try to book and check for errors
3. Check Network tab for failed requests
4. Look at error messages shown on screen
5. Verify you're logged in (check navbar)

## Common Errors

### "Failed to search flights"
- Check if backend is running
- Check browser console for detailed error
- Verify MongoDB is connected

### "Not authorized" or 401 errors
- Your session may have expired
- Logout and login again
- Check if token exists in localStorage

### "Flight not found" when booking
- The flight may have been deleted
- Try searching for flights again
- Check if flight ID is valid

### "Not enough seats available"
- The flight has been fully booked
- Try selecting a different flight
- Or reduce number of passengers

## Step-by-Step Debugging

### For Search Issues:
1. **Verify backend is running:**
   ```bash
   cd backend
   npm start
   ```
   Should see: "Server running on port 5000"

2. **Test API directly:**
   Open browser and go to: `http://localhost:5000/api/flights`
   Should see JSON response with flights

3. **Check frontend console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Try searching and see errors

4. **Check Network tab:**
   - Open DevTools (F12)
   - Go to Network tab
   - Try searching
   - Look for `/api/flights` request
   - Check response status and data

### For Booking Issues:
1. **Verify you're logged in:**
   - Check navbar shows your name
   - If not, login again

2. **Check browser console:**
   - Open DevTools (F12)
   - Look for errors when clicking "Book Now"

3. **Test booking API:**
   - Check Network tab in DevTools
   - Look for POST request to `/api/bookings`
   - Check request payload and response

4. **Verify passenger data:**
   - Make sure all fields are filled
   - Names should not be empty
   - Ages should be valid numbers

## Quick Fixes

### If search returns no results:
1. Make sure you have flights in database (add via Admin Panel)
2. Try searching with exact city names from flight data
3. Check if origin/destination match flight data exactly

### If booking button doesn't work:
1. Make sure you're logged in
2. Check browser console for JavaScript errors
3. Try refreshing the page
4. Clear browser cache and try again

### If "Book Now" redirects to login:
- Your session expired
- Login again and try booking

## Still Having Issues?

1. Check backend terminal for errors
2. Check frontend terminal for errors
3. Check browser console (F12) for errors
4. Verify MongoDB is running and connected
5. Make sure both frontend and backend are running

## Testing Checklist

- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 3000)
- [ ] MongoDB is connected
- [ ] You are logged in
- [ ] There are flights in the database
- [ ] Browser console shows no errors
- [ ] Network requests are successful (200 status)

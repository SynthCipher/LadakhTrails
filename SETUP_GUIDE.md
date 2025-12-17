# MongoDB & Admin Panel Integration Guide

## ✅ What's Been Set Up

### Backend (MongoDB Integration)

- ✅ MongoDB connected with provided URI: `mongodb+srv://onela:emdh8KUiBIo7pseh@cluster0.jufreng.mongodb.net`
- ✅ Tour model created for storing tour details
- ✅ Booking model created for storing customer bookings
- ✅ API endpoints for CRUD operations on tours and bookings

### Frontend (React)

- ✅ AdminTours page with password protection (password: `12345678`)
- ✅ UpcomingTours component fetches tours from MongoDB
- ✅ BookingModal saves bookings to MongoDB before sending to WhatsApp
- ✅ Admin can view all applicants for each tour

---

## 🚀 How to Use

### 1. Start the Backend Server

```bash
cd backend
npm run server
```

The backend will connect to MongoDB and run on `http://localhost:8081`

### 2. Start the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 📱 Admin Panel Usage

### Access Admin Panel

1. Navigate to `http://localhost:5173/admin/tours`
2. Enter password: `12345678`
3. Click "Login"

### Add a Tour

1. Fill in the tour details:

   - **Tour Name**: e.g., "Birding in January"
   - **Tour Type**: Select from dropdown (General, Wildlife, Winter Sports, Birding)
   - **Start Date**: Date picker
   - **End Date**: Date picker
   - **Price Per Person**: e.g., "₹45,000"
   - **Available Seats**: Number of seats
   - **Description**: Tour description
   - **Highlights**: Comma-separated list (e.g., "Highlight 1, Highlight 2, Highlight 3")

2. Click "Add Tour"
3. Tour is saved to MongoDB and immediately appears in the list

### View Tour Applicants

1. In the "Upcoming Tours" list, click on the **tour name** or the **Eye icon**
2. A modal will open showing all applicants with:
   - Customer name
   - Email and phone
   - Number of people
   - Preferred dates
   - Special requests
   - Booking status (pending/confirmed/cancelled)

### Edit a Tour

1. Click the **yellow Edit button** next to any tour
2. Form will populate with tour details
3. Make changes and click "Update Tour"

### Delete a Tour

1. Click the **red Trash button** next to any tour
2. Confirm deletion
3. Tour is removed from MongoDB

### Logout

Click the "Logout" button at the top right to exit admin panel

---

## 👥 Customer Booking Flow

### From Home Page

1. Customers see "Upcoming Scheduled Tours" section
2. Tours are fetched from MongoDB in real-time
3. Each tour card shows:
   - Tour name and type (with emoji icon)
   - Dates, price, available seats
   - Description
   - Highlights preview (first 3)

### Booking Process

1. Customer clicks "Book Now" on any tour card
2. BookingModal opens with tour details pre-filled
3. Customer fills in:

   - Full name
   - Email
   - Phone number
   - Number of people
   - Preferred dates (dropdown with predefined slots)
   - Special requests (optional)

4. Clicks "Send via WhatsApp"
5. **Two things happen**:
   - Booking is saved to MongoDB (can be viewed in admin panel)
   - Customer is directed to WhatsApp with pre-filled message

---

## 📊 Data Flow

```
Admin Adds Tour
    ↓
Saved to MongoDB
    ↓
UpcomingTours component fetches from MongoDB
    ↓
Displayed on Home page
    ↓
Customer clicks "Book Now"
    ↓
BookingModal opens
    ↓
Customer submits booking
    ↓
Booking saved to MongoDB (viewable in Admin)
    ↓
Customer directed to WhatsApp
```

---

## 🔐 Security Notes

- **Admin Password**: `12345678` - Keep this secure!
- **Authentication**: Session storage (login persists until browser is closed)
- **MongoDB URI**: Already configured in backend `.env`
- **WhatsApp Number**: `919682574824`

### To Change Admin Password

Edit in `frontend/src/pages/AdminTours.jsx`, line 40:

```javascript
if (password === '12345678') {  // Change this value
```

### To Change WhatsApp Number

Edit in `frontend/src/components/BookingModal.jsx`, line 73:

```javascript
const whatsappNumber = "919682574824"; // Change this value
```

---

## 🐛 Troubleshooting

### "Failed to fetch tours. Make sure backend is running."

- ✅ Ensure backend server is running (`npm run server` in backend folder)
- ✅ Check that MongoDB connection is working
- ✅ Verify backend is running on `http://localhost:8081`

### Tours not showing on home page

- ✅ Make sure at least one tour is added from admin panel
- ✅ Check browser console for errors
- ✅ Ensure backend is running and MongoDB is connected

### Bookings not saving

- ✅ Check backend console for errors
- ✅ Verify MongoDB connection
- ✅ Ensure backend is running

### Admin login fails

- ✅ Password is `12345678` (case-sensitive)
- ✅ Clear browser cookies if needed

---

## 📦 MongoDB Collections

### Tours Collection

```json
{
  "_id": ObjectId,
  "tourName": "string",
  "tourType": "General|Wildlife|Winter Sports|Birding",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "price": "string (e.g., ₹45,000)",
  "availableSeats": number,
  "description": "string",
  "highlights": "comma,separated,string",
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

### Bookings Collection

```json
{
  "_id": ObjectId,
  "tourId": ObjectId (reference to tour),
  "tourName": "string",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "numberOfPeople": number,
  "tourDate": "string",
  "specialRequests": "string",
  "status": "pending|confirmed|cancelled",
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

---

## ✨ Features Implemented

✅ Password-protected admin panel
✅ Create, Read, Update, Delete tours (MongoDB)
✅ View all bookings for each tour with customer details
✅ Real-time sync between admin and customer views
✅ Booking data saved to MongoDB before WhatsApp
✅ Predefined date slots for bookings
✅ Beautiful modal interface for applicants
✅ Session-based authentication

---

## 🎯 Next Steps (Optional)

If you want to enhance the system further:

- Add email confirmations for bookings
- Implement booking status updates (pending → confirmed)
- Add tour image uploads
- Implement payment integration
- Add multi-language support
- Export bookings to CSV/PDF
- Send admin notifications for new bookings

---

**System Ready to Use!** 🚀

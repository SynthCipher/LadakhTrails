# 📋 Quick Reference Card

## 🚀 Getting Started (In 3 Steps)

### Step 1: Start Backend

```powershell
cd backend
npm run server
```

Backend runs on: `http://localhost:8081`

### Step 2: Start Frontend

```powershell
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:5173`

### Step 3: Access Admin Panel

```
URL: http://localhost:5173/admin/tours
Password: 12345678
```

---

## 🔑 Important Credentials & URLs

### Admin Access

- **URL**: `http://localhost:5173/admin/tours`
- **Password**: `12345678`

### Database

- **Type**: MongoDB Atlas
- **URI**: `mongodb+srv://onela:emdh8KUiBIo7pseh@cluster0.jufreng.mongodb.net`

### WhatsApp Integration

- **Phone**: `919682574824`
- **Integration**: wa.me (automatic on booking)

### Backend API Base URL

- **URL**: `http://localhost:8081/api/tour`

---

## 📝 Core File Changes

| File                                         | What Changed | Line                             |
| -------------------------------------------- | ------------ | -------------------------------- |
| `/backend/config/mongodb.js`                 | ✅ Created   | Mongoose connection              |
| `/backend/models/tourModel.js`               | ✅ Created   | Tour schema                      |
| `/backend/models/bookingModel.js`            | ✅ Created   | Booking schema                   |
| `/backend/routes/tourRoute.js`               | ✅ Created   | All API endpoints                |
| `/backend/server.js`                         | Updated      | Import + route                   |
| `/backend/.env`                              | Updated      | MongoDB URI                      |
| `/frontend/src/pages/AdminTours.jsx`         | Replaced     | Full rewrite with MongoDB + auth |
| `/frontend/src/components/BookingModal.jsx`  | Updated      | Save booking + handle tourId     |
| `/frontend/src/components/UpcomingTours.jsx` | Updated      | Fetch from MongoDB               |

---

## 🎯 Admin Panel Quick Guide

### Add Tour

```
1. Fill form with tour details
2. Click "Add Tour"
3. Tour saved to MongoDB
4. Tour appears on home page
```

### View Applicants

```
1. Click tour name in list
2. Modal opens with all bookings
3. See customer details
```

### Edit Tour

```
1. Click yellow Edit button
2. Form populates
3. Make changes
4. Click "Update Tour"
```

### Delete Tour

```
1. Click red Delete button
2. Confirm deletion
3. Tour removed
```

### Logout

```
Click red "Logout" button
```

---

## 🔗 API Endpoints

### Tours

```
POST   /api/tour/add              → Add tour
PUT    /api/tour/update/:id       → Update tour
DELETE /api/tour/delete/:id       → Delete tour
GET    /api/tour/all              → Get all tours
GET    /api/tour/:id              → Get single tour
```

### Bookings

```
POST   /api/tour/booking/add      → Create booking
GET    /api/tour/booking/:tourId  → Get tour bookings
GET    /api/tour/bookings/all     → Get all bookings
```

---

## 🧪 Test Commands

### Check Backend

```bash
curl http://localhost:8081/
# Should respond with: "hello Server is Working"
```

### Get All Tours

```bash
curl http://localhost:8081/api/tour/all
# Returns JSON with all tours
```

### Add Test Tour

```bash
curl -X POST http://localhost:8081/api/tour/add \
  -H "Content-Type: application/json" \
  -d '{
    "tourName": "Test Tour",
    "tourType": "Birding",
    "startDate": "2024-01-15",
    "endDate": "2024-01-20",
    "price": "₹50,000",
    "availableSeats": 10,
    "description": "Test",
    "highlights": "Feature 1, Feature 2"
  }'
```

---

## 🐛 Troubleshooting

| Problem              | Solution                                      |
| -------------------- | --------------------------------------------- |
| Backend won't start  | Check MongoDB URI in `.env`                   |
| Tours not showing    | Ensure backend is running                     |
| Admin login fails    | Password is `12345678` (case-sensitive)       |
| Bookings not saving  | Verify backend console for errors             |
| Can't see applicants | Make sure tour has bookings + click "Refresh" |

---

## 📊 Database Collections

### `tours` Collection

```
- tourName (string)
- tourType (enum)
- startDate (date)
- endDate (date)
- price (string)
- availableSeats (number)
- description (string)
- highlights (string, comma-separated)
- createdAt (timestamp)
- updatedAt (timestamp)
```

### `bookings` Collection

```
- tourId (reference to tour._id)
- tourName (string)
- fullName (string)
- email (string)
- phone (string)
- numberOfPeople (number)
- tourDate (string)
- specialRequests (string, optional)
- status (enum: pending, confirmed, cancelled)
- createdAt (timestamp)
- updatedAt (timestamp)
```

---

## 🔄 Complete Data Flow

```
Admin Panel (React)
    ↓ HTTP Request
    ↓ POST /api/tour/add
    ↓
Backend (Express)
    ↓ Create Document
    ↓ Save to DB
    ↓
MongoDB Database
    ↓ Return response
    ↓
Frontend Updates
    ↓
Home Page Displays
    ↓
Customer Visits
    ↓
Customer Books
    ↓
POST /api/tour/booking/add
    ↓
Saved to MongoDB
    ↓
Admin Sees in Panel
```

---

## 📱 Frontend Components

```
App.jsx
├── Navbar
├── Routes:
│   ├── Home
│   │   ├── Hero
│   │   ├── UpcomingTours (fetches from MongoDB)
│   │   └── Static tours
│   ├── General/Wildlife/Winter/Birding
│   │   └── BookingModal (saves to MongoDB)
│   ├── About/FAQ/Terms
│   └── AdminTours (password protected)
└── Footer
```

---

## ⚙️ Configuration Changes

### To Change Admin Password

**File**: `/frontend/src/pages/AdminTours.jsx`
**Line**: 40

```javascript
if (password === '12345678') {  // Change this value
```

### To Change WhatsApp Number

**File**: `/frontend/src/components/BookingModal.jsx`
**Line**: 73

```javascript
const whatsappNumber = "919682574824"; // Change this value
```

### To Change Backend URL

**Files**:

- `AdminTours.jsx` (line 26)
- `BookingModal.jsx` (line 25)
- `UpcomingTours.jsx` (line 10)

```javascript
const backendUrl = "http://localhost:8081"; // Change this value
```

---

## 📚 Documentation Files

| File                     | Purpose                    |
| ------------------------ | -------------------------- |
| `README_MONGODB.md`      | Complete system overview   |
| `SETUP_GUIDE.md`         | How to start and use       |
| `ADMIN_GUIDE.md`         | Detailed admin panel guide |
| `API_DOCUMENTATION.md`   | API endpoints reference    |
| `MONGODB_INTEGRATION.md` | Integration details        |
| `SYSTEM_OVERVIEW.md`     | Full system architecture   |

---

## ✅ Pre-Launch Checklist

- [ ] Backend running: `npm run server` ✓
- [ ] Frontend running: `npm run dev` ✓
- [ ] Can access admin: `localhost:5173/admin/tours` ✓
- [ ] Admin login works with `12345678` ✓
- [ ] Can add a tour ✓
- [ ] Tour appears on home page ✓
- [ ] Can book a tour ✓
- [ ] Booking saves to database ✓
- [ ] Can view applicants ✓
- [ ] WhatsApp integration works ✓

---

## 🚀 Ready to Go!

Your system is complete. You can now:

1. **Manage Tours** - Add, edit, delete from admin panel
2. **Track Bookings** - See all applicants with details
3. **Automate Messaging** - WhatsApp integration
4. **Persist Data** - MongoDB stores everything
5. **Scale** - Can add more tours anytime

---

## 💡 Tips

- **Always refresh** after adding/deleting tours
- **Check MongoDB** directly if unsure about data
- **Keep password secure** - Change from default
- **Monitor bookings** regularly
- **Backup data** periodically from MongoDB Atlas

---

## 🔗 Quick Links

- **React Docs**: https://react.dev
- **MongoDB Docs**: https://www.mongodb.com/docs
- **Tailwind CSS**: https://tailwindcss.com
- **Express Guide**: https://expressjs.com
- **Lucide Icons**: https://lucide.dev

---

**Status**: ✅ System Complete & Operational
**Last Updated**: December 16, 2025

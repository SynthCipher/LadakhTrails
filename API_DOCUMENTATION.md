# API Documentation

## Base URL

```
http://localhost:8081/api/tour
```

---

## Tour Endpoints

### 1. Add New Tour

**POST** `/add`

**Request Body:**

```json
{
  "tourName": "Birding Adventure",
  "tourType": "Birding",
  "startDate": "2024-01-15",
  "endDate": "2024-01-20",
  "price": "₹50,000",
  "availableSeats": 12,
  "description": "Explore the beautiful landscapes of Ladakh...",
  "highlights": "Highlight 1, Highlight 2, Highlight 3"
}
```

**Response:**

```json
{
  "success": true,
  "tour": {
    "_id": "507f1f77bcf86cd799439011",
    "tourName": "Birding Adventure",
    "tourType": "Birding",
    "startDate": "2024-01-15",
    "endDate": "2024-01-20",
    "price": "₹50,000",
    "availableSeats": 12,
    "description": "...",
    "highlights": "...",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

---

### 2. Update Tour

**PUT** `/update/:id`

**Parameters:**

- `id` - MongoDB tour ID (string)

**Request Body:** (same as Add Tour)

**Response:** (returns updated tour object)

---

### 3. Delete Tour

**DELETE** `/delete/:id`

**Parameters:**

- `id` - MongoDB tour ID (string)

**Response:**

```json
{
  "success": true,
  "message": "Tour deleted"
}
```

---

### 4. Get All Tours

**GET** `/all`

**Response:**

```json
{
  "success": true,
  "tours": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "tourName": "Birding Adventure",
      "tourType": "Birding",
      "startDate": "2024-01-15",
      "endDate": "2024-01-20",
      "price": "₹50,000",
      "availableSeats": 12,
      "description": "...",
      "highlights": "...",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
    // ... more tours
  ]
}
```

---

### 5. Get Single Tour

**GET** `/:id`

**Parameters:**

- `id` - MongoDB tour ID (string)

**Response:** (returns single tour object)

---

## Booking Endpoints

### 1. Add Booking

**POST** `/booking/add`

**Request Body:**

```json
{
  "tourId": "507f1f77bcf86cd799439011",
  "tourName": "Birding Adventure",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "numberOfPeople": 2,
  "tourDate": "January 15-20",
  "specialRequests": "Vegetarian meals needed"
}
```

**Response:**

```json
{
  "success": true,
  "booking": {
    "_id": "607f1f77bcf86cd799439012",
    "tourId": "507f1f77bcf86cd799439011",
    "tourName": "Birding Adventure",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43210",
    "numberOfPeople": 2,
    "tourDate": "January 15-20",
    "specialRequests": "Vegetarian meals needed",
    "status": "pending",
    "createdAt": "2024-01-01T10:30:00.000Z",
    "updatedAt": "2024-01-01T10:30:00.000Z"
  }
}
```

---

### 2. Get Bookings for a Tour

**GET** `/booking/:tourId`

**Parameters:**

- `tourId` - MongoDB tour ID (string)

**Response:**

```json
{
  "success": true,
  "bookings": [
    {
      "_id": "607f1f77bcf86cd799439012",
      "tourId": "507f1f77bcf86cd799439011",
      "tourName": "Birding Adventure",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+91 98765 43210",
      "numberOfPeople": 2,
      "tourDate": "January 15-20",
      "specialRequests": "Vegetarian meals needed",
      "status": "pending",
      "createdAt": "2024-01-01T10:30:00.000Z",
      "updatedAt": "2024-01-01T10:30:00.000Z"
    }
    // ... more bookings
  ]
}
```

---

### 3. Get All Bookings

**GET** `/bookings/all`

**Response:** (returns array of all booking objects)

---

## Error Responses

### Standard Error Response

```json
{
  "success": false,
  "message": "Error description here"
}
```

### Common Errors

| Status | Message          | Cause                    |
| ------ | ---------------- | ------------------------ |
| 400    | Validation error | Missing required fields  |
| 404    | Tour not found   | Invalid tour ID          |
| 500    | Server error     | MongoDB connection issue |

---

## Example Usage (Frontend)

### Add a Tour

```javascript
const response = await fetch("http://localhost:8081/api/tour/add", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    tourName: "Birding Adventure",
    tourType: "Birding",
    startDate: "2024-01-15",
    endDate: "2024-01-20",
    price: "₹50,000",
    availableSeats: 12,
    description: "Explore the beautiful landscapes...",
    highlights: "Highlight 1, Highlight 2, Highlight 3",
  }),
});

const data = await response.json();
if (data.success) {
  console.log("Tour added:", data.tour);
} else {
  console.error("Error:", data.message);
}
```

### Get All Tours

```javascript
const response = await fetch("http://localhost:8081/api/tour/all");
const data = await response.json();

if (data.success) {
  console.log("All tours:", data.tours);
} else {
  console.error("Error:", data.message);
}
```

### Add a Booking

```javascript
const response = await fetch("http://localhost:8081/api/tour/booking/add", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    tourId: "507f1f77bcf86cd799439011",
    tourName: "Birding Adventure",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+91 98765 43210",
    numberOfPeople: 2,
    tourDate: "January 15-20",
    specialRequests: "Vegetarian meals",
  }),
});

const data = await response.json();
if (data.success) {
  console.log("Booking saved:", data.booking);
} else {
  console.error("Error:", data.message);
}
```

### Get Bookings for a Tour

```javascript
const tourId = "507f1f77bcf86cd799439011";
const response = await fetch(
  `http://localhost:8081/api/tour/booking/${tourId}`
);
const data = await response.json();

if (data.success) {
  console.log("Bookings:", data.bookings);
} else {
  console.error("Error:", data.message);
}
```

---

## Database Schema

### Tour Schema

```javascript
{
  tourName: String (required),
  tourType: String (enum: ['General', 'Wildlife', 'Winter Sports', 'Birding']),
  startDate: String (required),
  endDate: String (required),
  price: String (required),
  availableSeats: Number (required),
  description: String (required),
  highlights: String (required, comma-separated),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Booking Schema

```javascript
{
  tourId: ObjectId (reference to Tour),
  tourName: String (required),
  fullName: String (required),
  email: String (required),
  phone: String (required),
  numberOfPeople: Number (required),
  tourDate: String (required),
  specialRequests: String (optional),
  status: String (enum: ['pending', 'confirmed', 'cancelled'], default: 'pending'),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## Testing with cURL

### Add Tour

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
    "description": "Test description",
    "highlights": "Highlight 1, Highlight 2"
  }'
```

### Get All Tours

```bash
curl http://localhost:8081/api/tour/all
```

### Add Booking

```bash
curl -X POST http://localhost:8081/api/tour/booking/add \
  -H "Content-Type: application/json" \
  -d '{
    "tourId": "TOUR_ID_HERE",
    "tourName": "Test Tour",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43210",
    "numberOfPeople": 2,
    "tourDate": "January 15-20",
    "specialRequests": "None"
  }'
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding for production.

---

## Authentication

Currently no authentication on API endpoints. Admin authentication is handled in frontend (session storage).

For production, consider:

- Adding JWT tokens
- Implementing API key authentication
- Adding role-based access control

---

## CORS

CORS is enabled in backend (`app.use(cors())`) to allow frontend requests.

---

**Last Updated**: 2024
**API Version**: 1.0

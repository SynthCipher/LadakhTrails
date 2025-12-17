# Admin Panel User Guide

## 🔐 Admin Login

### Step 1: Navigate to Admin Panel

```
URL: http://localhost:5173/admin/tours
```

You'll see a login screen with password field.

### Step 2: Enter Password

```
Password: 12345678
```

**Note**: Password is case-sensitive!

### Step 3: Click Login Button

Once authenticated, you'll see the admin dashboard.

---

## 📝 Adding a New Tour

### Form Fields

#### 1. **Tour Name** (Required)

- **Example**: "Birding in January 2024"
- **Description**: Name of the tour package

#### 2. **Tour Type** (Required - Dropdown)

- Options: `General Tour` | `Wildlife Tour` | `Winter Sports` | `Birding Tour`
- **Example**: Select "Birding Tour"

#### 3. **Start Date** (Required)

- **Format**: YYYY-MM-DD
- **Example**: 2024-01-15
- Click the calendar icon to select

#### 4. **End Date** (Required)

- **Format**: YYYY-MM-DD
- **Example**: 2024-01-20
- Must be after start date

#### 5. **Price Per Person** (Required)

- **Format**: Can include currency symbol
- **Example**: ₹50,000
- **Or**: Rs 50,000
- **Or**: 50000

#### 6. **Available Seats** (Required)

- **Format**: Whole number
- **Example**: 12
- **Meaning**: Total number of people who can book this tour

#### 7. **Description** (Required)

- **Format**: Free text (multiline)
- **Example**: "Experience the beautiful Ladakh landscape while spotting rare birds. Our expert guides will lead you through pristine valleys and high-altitude passes..."
- **Note**: Appears on tour card on home page

#### 8. **Highlights** (Required)

- **Format**: Comma-separated list
- **Example**: `Rare bird spotting, Expert naturalist guides, Photography opportunities, High altitude trekking, Traditional monastery visits`
- **Note**: Comma AND space between items
- **Display**: First 3 highlights shown on home page card

### Complete Example

```
Tour Name: Premium Birding of Ladakh
Tour Type: Birding Tour
Start Date: 2024-03-10
End Date: 2024-03-18
Price Per Person: ₹65,000
Available Seats: 10
Description: Join us for an exclusive 8-day birding expedition in the stunning Ladakh region. This premium tour is designed for serious birdwatchers and nature enthusiasts. Our experienced guides will take you to the best birding hotspots including high-altitude lakes, valleys, and monasteries.
Highlights: Black-necked cranes spotting, Lammergeier and Golden eagles, Bharal blue sheep, Expert birding guides, Professional photography support, Traditional Ladakhi meals, Luxury accommodations
```

### Submit

Click **"Add Tour"** button at the bottom to save the tour.

**Success**: You'll see an alert "Tour added successfully!" and the tour will appear in the list below.

---

## 👥 Viewing Tour Applicants

### Step 1: Find the Tour

Scroll through the "Upcoming Tours" list to find the tour you want to check.

### Step 2: Click on Tour Name

Click directly on the **tour name** or the **Eye icon** next to it.

**Example**:

```
🦅 Premium Birding of Ladakh  👁️
```

### Step 3: View Applicants Modal

A modal window will open showing:

- **Total Applicants Count**: e.g., "Total Applicants: 5"
- **List of Applicants** with:
  - **Applicant #**: Serial number
  - **Name**: Full name
  - **Status Badge**: pending (yellow) | confirmed (green) | cancelled (red)
  - **Email**: Customer email
  - **Phone**: Contact number
  - **People**: Number of people in the group
  - **Date**: Preferred tour dates
  - **Requests**: Special requests (if any)

### Example View

```
┌─────────────────────────────────────┐
│    Tour Applicants                  │
│  Total Applicants: 3                │
├─────────────────────────────────────┤
│                                     │
│ #1 Raj Kumar                [pending]│
│ Email: raj@email.com               │
│ Phone: +91 98765 43210             │
│ People: 2                          │
│ Date: March 10-18                  │
│ Requests: Vegetarian meals needed  │
│                                     │
│ #2 Priya Singh              [pending]│
│ Email: priya@email.com             │
│ Phone: +91 97654 32109             │
│ People: 3                          │
│ Date: March 10-18                  │
│ Requests: None                     │
│                                     │
│ #3 Ahmed Patel             [confirmed]│
│ Email: ahmed@email.com             │
│ Phone: +91 96543 21098             │
│ People: 1                          │
│ Date: March 10-18                  │
│ Requests: Photography permit info  │
│                                     │
└─────────────────────────────────────┘
```

### Close Modal

Click the **X button** in the top-right corner to close the applicants modal.

---

## ✏️ Editing a Tour

### Step 1: Find the Tour

Locate the tour in the "Upcoming Tours" list.

### Step 2: Click Edit Button

Click the **yellow Edit button** (with pencil icon) on the right side.

```
[Yellow Edit Button] [Red Delete Button]
```

### Step 3: Form Auto-Populates

All fields will be filled with the current tour data.

### Step 4: Make Changes

Modify any fields you need to update:

- Change dates
- Update price
- Add more seats
- Edit description
- Update highlights

### Step 5: Click Update Button

Click **"Update Tour"** button at the bottom.

**Success**: You'll see an alert "Tour updated successfully!" and the changes will be reflected immediately.

### Cancel Editing

If you want to cancel, click the **"Cancel"** button next to "Update Tour" button.

---

## 🗑️ Deleting a Tour

### Step 1: Find the Tour

Locate the tour in the "Upcoming Tours" list.

### Step 2: Click Delete Button

Click the **red Trash button** (with trash icon) on the right side.

### Step 3: Confirm Deletion

A confirmation dialog will appear asking:

```
"Are you sure you want to delete this tour?"
```

Click **"OK"** to confirm deletion or **"Cancel"** to keep the tour.

**Warning**: This action cannot be undone. All bookings for this tour will still be saved in the database.

### Step 4: Success

You'll see an alert "Tour deleted successfully!" and the tour will be removed from the list.

---

## 🔄 Refreshing the Tours List

Click the **"Refresh"** button (green) at the top-right of the "Upcoming Tours" section to reload the latest tours from the database.

**Useful when**:

- You want to ensure you're seeing the latest data
- Tours seem out of sync
- Another admin made changes

---

## 🚪 Logging Out

### Step 1: Click Logout Button

Click the **red "Logout"** button in the top-right corner.

### Step 2: Confirm

You'll be redirected to the login page.

### Step 3: Session Cleared

Your session is cleared. You'll need to enter the password again to access the admin panel.

---

## 💡 Pro Tips

### Tip 1: Format Highlights Well

Use commas and spaces to separate highlights:

```
❌ Wrong: "Highlight1,Highlight2,Highlight3"
✅ Right: "Highlight 1, Highlight 2, Highlight 3"
```

### Tip 2: Use Consistent Date Format

Always use YYYY-MM-DD format:

```
✅ 2024-01-15
❌ 15-01-2024
❌ 01/15/2024
```

### Tip 3: Price Format

You can use any of these formats - they all work:

```
✅ ₹50,000
✅ Rs 50,000
✅ 50000
✅ ₹50000
```

### Tip 4: Check Applicants Regularly

Keep checking the applicants list to:

- Respond to booking inquiries
- See special requests
- Track bookings by date

### Tip 5: Use Refresh Button

If tours seem outdated, click "Refresh" to get the latest data.

---

## 🎨 Interface Guide

### Main Sections

#### 1. **Top Bar**

```
├─ Title: "Manage Tours"
└─ Logout Button (red)
```

#### 2. **Form Section** (white background)

```
├─ Title: "Add New Tour" or "Edit Tour"
├─ Input Fields (8 total)
└─ Submit Buttons
```

#### 3. **Tours List Section** (white background)

```
├─ Title: "Upcoming Tours (count)"
├─ Refresh Button (green)
└─ Tour Cards
   ├─ Tour name and type
   ├─ Details grid (dates, price, seats, status)
   ├─ Description
   ├─ Edit/Delete buttons
   └─ Click to view applicants
```

---

## 📱 Responsive Design

### Desktop View (1024px+)

- All fields in 2-column layout
- Full width form
- Side-by-side buttons

### Tablet View (768px - 1023px)

- Adjusted column layout
- Proper spacing
- Touch-friendly buttons

### Mobile View (<768px)

- Single-column layout
- Full-width fields
- Stacked buttons
- Scrollable tour cards

---

## ⚠️ Important Notes

1. **Date Validation**: End date must be after start date
2. **Required Fields**: All 8 fields are mandatory (marked with \*)
3. **Highlights Format**: Use comma-separated values, NOT newlines
4. **WhatsApp Number**: Currently set to 919682574824 (configured in backend)
5. **Data Persistence**: All data is stored in MongoDB, persistent across sessions

---

## 🆘 Common Issues

### Issue: "Tour not updating"

- **Solution**: Make sure you filled all required fields
- Check that dates are in YYYY-MM-DD format
- Click the "Refresh" button to reload

### Issue: "Can't see applicants"

- **Solution**: Make sure the tour was saved successfully
- Tour must have at least one booking to show in applicants list
- Try refreshing the page

### Issue: "Login fails"

- **Solution**: Password is exactly `12345678`
- Clear browser cookies
- Try refreshing the login page

### Issue: "Deleted tour still shows"

- **Solution**: Click "Refresh" button to reload the list
- The tour might be cached in browser

---

## 📊 Understanding the Status Badges

When viewing applicants, each booking has a status:

| Status        | Color  | Meaning                                 |
| ------------- | ------ | --------------------------------------- |
| **pending**   | Yellow | Booking received, awaiting confirmation |
| **confirmed** | Green  | Booking confirmed by admin              |
| **cancelled** | Red    | Booking cancelled                       |

---

## 🎯 Quick Workflow

1. ✅ Login with password
2. ✅ Fill tour details
3. ✅ Click "Add Tour"
4. ✅ Tour appears on home page
5. ✅ Customers can book
6. ✅ Click tour name to see applicants
7. ✅ Respond to customers on WhatsApp
8. ✅ Delete old tours or edit as needed
9. ✅ Logout when done

---

**Admin Panel is now ready to use!** 🚀

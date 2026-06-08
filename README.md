# Event Registration System API

A Node.js/Express REST API for managing event registrations with full race condition protection.

> **Assessment Code:** B0626 — Backend Developer Intern @ Innovaxel

---

## Tech Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Concurrency | MongoDB Atomic Operators (`$inc`) |

---

## How It Works

### 1. Create Event
Validates that the event name is unique, the date is in the future, and seat count is a positive number — then saves to the database.

![Create Event Workflow](./pic/Create%20Event%20Workflow.png)

---

### 2. Register a User
This is the core of the system. Instead of the unsafe **read → check → write** pattern, registration uses a **single atomic database operation** to check and reserve a seat simultaneously — preventing overbooking even under heavy concurrent traffic.

```js
// Atomic: checks availability AND decrements in one operation
Event.findOneAndUpdate(
  { _id: eventId, availableSeats: { $gt: 0 } },
  { $inc: { availableSeats: -1 } }
)
```

A **Compound Unique Index** `{ eventId, userName }` on the Registration schema blocks duplicate signups at the database level. If a seat was decremented but the registration insert fails (e.g. duplicate), the seat is immediately restored via rollback.

![User Registration Workflow](./pic/User%20Registration.png)

---

### 3. Cancel Registration
Marks the registration as `cancelled` and atomically restores the seat back to the event pool.

![Cancel Registration Workflow](./pic/Cancel%20Registration.png)

---

## Race Condition Protection — Summary

| Threat | Solution |
|---|---|
| Two users booking the last seat | Atomic `findOneAndUpdate` with `$gt: 0` guard |
| Double-click / duplicate requests | Compound Unique Index throws `E11000` |
| Seat leak on failed registration | `catch` block runs atomic rollback (`$inc: +1`) |

---

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd event-registration-api
npm install
```

### 2. Configure Environment

Create a `.env` file in the root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/event_registration_db
```

### 3. Run the Server

```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/events` | Create a new event |
| `POST` | `/api/events/:id/register` | Register a user for an event |
| `PATCH` | `/api/registrations/:id/cancel` | Cancel a registration |
| `GET` | `/api/events/:id` | Get event details |

---

## Test Results

All scenarios tested via PowerShell integration scripts.

| # | Scenario | Result |
|---|---|---|
| 1.1 | Create event (valid data) | ✅ `availableSeats` initialized correctly |
| 1.2 | Create event (duplicate name) | ✅ Rejected — `"Event name must be unique"` |
| 1.3 | Create event (past date) | ✅ Rejected — `"Event date must be in the future"` |
| 2.0 | Successful registration | ✅ Seats: 100 → 99 atomically |
| 3.0 | Duplicate registration attempt | ✅ Blocked — `"User already registered"` |
| 3.1 | Seat count after duplicate attempt | ✅ Stayed at 99 — no seat leak |
| 4.0 | Cancel registration | ✅ Status set to `cancelled` |
| 4.1 | Seat count after cancellation | ✅ Seats: 99 → 100 atomically |

---

*Built with ❤️ for the Innovaxel Backend Developer Intern assessment.*
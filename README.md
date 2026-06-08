# Event Registration System API 🚀
> **Assessment Code:** B0626  
> **Position:** Backend Developer Intern (Take-Home Assessment)  
> **Company:** Innovaxel  

A production-ready, highly reliable Node.js/Express API designed to handle real-world concurrent event registrations. This system completely eliminates **Race Conditions (Overbooking)** and guarantees data consistency using **Atomic Operations** and database-level constraints with MongoDB & Mongoose.

---

## 🛠️ Tech Stack & Architecture

- **Backend Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Concurrency & Validation:** MongoDB Atomic Operators (`$inc`), Compound Unique Indexes, Schema Validators.

---

## 🎯 System Workflows & Design Diagrams

### 1. Create Event Workflow
Handles incoming event generation, validating that numbers are correct, dates are strictly in the future, and names remain universally unique.

![Flowchart showing event creation steps with validation for future dates, seat counts, and unique event names]("./Pic/Create Event Workflow.png")

### 2. User Registration Workflow (Race Condition Protection)
The core architecture of the app. It prevents multi-user race conditions using single-operation database locks and rollbacks upon duplication.

![Flowchart showing registration process with atomic seat decrement and duplicate prevention using compound unique indexes]("./Pic/User Registration.png")

### 3. Cancel Registration Workflow
Handles accurate seat restoration atomically, moving the registration status to `'cancelled'`.

![Flowchart showing cancellation process with registration status set to cancelled and seat restoration via atomic update]("./Pic/Cancel Registration.png")

---

## ⚡ Concurrency & Race Condition Defense

1. **Atomic Seat Decrements:** Instead of standard "Read-then-Write" operations (`findById` -> `if check` -> `save`), which can cause overbooking during rapid parallel requests, the system utilizes an atomic `findOneAndUpdate` statement:
   ```javascript
   { _id: eventId, availableSeats: { $gt: 0 } }, { $inc: { availableSeats: -1 } }
   ```
   This ensures that MongoDB checks and reserves the seat in a single un-interruptible database thread transaction.
2. **Idempotency & Duplicate Prevention:** A **Compound Unique Index** `{ eventId: 1, userName: 1 }` is enabled on the Registration Schema. If a user tries to double-click or issue duplicate requests, MongoDB throws a strict `E11000` error.
3. **Data Integrity Rollback:** If a seat is successfully decremented but the subsequent registration fails due to a duplication restriction, the `catch` block performs an immediate atomic rollback (`$inc: { availableSeats: 1 }`), ensuring 100% seat tracking accuracy.

---

## 📊 Comprehensive Test Report (PowerShell Verified)

All aspects of the application have been thoroughly tested via terminal-based integration testing scripts.

| Test ID | Scenario | Expected Result | Status | Details / Logs Caught |
| :---: | :--- | :--- | :---: | :--- |
| **1.1** | Create Event (Valid Data) | Event creates with `availableSeats = totalSeats` | **✅ PASSED** | Event created successfully |
| **1.2** | Create Event (Duplicate Name) | Strict rejection via database layer | **✅ PASSED** | Error: `"Event name must be unique"` |
| **1.3** | Create Event (Past Date) | Custom validation schema trigger | **✅ PASSED** | Error: `"Event date must be in the future"` |
| **2.0** | Successful Registration | Seats decrement correctly dynamically | **✅ PASSED** | `availableSeats` moved 100 → 99 atomically |
| **3.0** | Duplicate User Registration | Second parallel request blocked | **✅ PASSED** | Error: `"User already registered for this event"` |
| **3.1** | Verify Seats After Duplication | Rollback works, data integrity maintained | **✅ PASSED** | `availableSeats` safely stayed at 99 (No leaks) |
| **4.0** | Cancel Registration | Status turns `cancelled`, seat returns | **✅ PASSED** | Status updated successfully |
| **4.1** | Verify Seat After Cancellation| Seat safely added back to the pool | **✅ PASSED** | `availableSeats` moved 99 → 100 atomically |

---

## ⚙️ Getting Started & Installation

### Prerequisite
Ensure you have **Node.js** and **MongoDB** installed and running on your local machine.

### 1. Environment Configurations
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/event_registration_db
```

### 2. Setup Dependencies
```bash
npm install
```

### 3. Run the Server
For standard runtime:
```bash
npm start
```
For Development (Auto-refresh via Nodemon):
```bash
npm run dev
```

---
*Developed with ❤️ as a submission for the Innovaxel Backend Developer Intern position.*

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

![Create Event Workflow](./pic/Create%20Event%20Workflow.png)

### 2. User Registration Workflow (Race Condition Protection)
The core architecture of the app. It prevents multi-user race conditions using single-operation database locks and rollbacks upon duplication.

![User Registration Workflow](./pic/User%20Registration.png)

### 3. Cancel Registration Workflow
Handles accurate seat restoration atomically, moving the registration status to `'cancelled'`.

![Cancel Registration Workflow](./pic/Cancel%20Registration.png)

---

## ⚡ Concurrency & Race Condition Defense

1. **Atomic Seat Decrements:** Instead of standard "Read-then-Write" operations (`findById` -> `if check` -> `save`), which can cause overbooking during rapid parallel requests, the system utilizes an atomic `findOneAndUpdate` statement:
   ```javascript
   { _id: eventId, availableSeats: { $gt: 0 } }, { $inc: { availableSeats: -1 } }
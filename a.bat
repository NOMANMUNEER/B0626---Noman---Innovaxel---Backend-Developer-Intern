@echo off
echo Creating Professional README.md without formatting errors...

(
echo # Event Registration System API 🚀
echo ^> **Assessment Code:** B0626  
echo ^> **Position:** Backend Developer Intern ^(Take-Home Assessment^)  
echo ^> **Company:** Innovaxel  
echo.
echo A production-ready, highly reliable Node.js/Express API designed to handle real-world concurrent event registrations. This system completely eliminates **Race Conditions ^(Overbooking^)** and guarantees data consistency using **Atomic Operations** and database-level constraints with MongoDB ^& Mongoose.
echo.
echo ---
echo.
echo ## 🛠️ Tech Stack ^& Architecture
echo.
echo - **Backend Runtime:** Node.js
echo - **Framework:** Express.js
echo - **Database:** MongoDB ^(with Mongoose ODM^)
echo - **Concurrency ^& Validation:** MongoDB Atomic Operators ^(`$inc`^), Compound Unique Indexes, Schema Validators.
echo.
echo ---
echo.
echo ## 🎯 System Workflows ^& Design Diagrams
echo.
echo ### 1. Create Event Workflow
echo Handles incoming event generation, validating that numbers are correct, dates are strictly in the future, and names remain universally unique.
echo.
echo ![^Create Event Workflow^]^("./pic/Create Event Workflow.png"^)
echo.
echo ### 2. User Registration Workflow ^(Race Condition Protection^)
echo The core architecture of the app. It prevents multi-user race conditions using single-operation database locks and rollbacks upon duplication.
echo.
echo ![^User Registration Workflow^]^("./pic/User Registration.png"^)
echo.
echo ### 3. Cancel Registration Workflow
echo Handles accurate seat restoration atomically, moving the registration status to `'cancelled'`.
echo.
echo ![^Cancel Registration Workflow^]^("./pic/Cancel Registration.png"^)
echo.
echo ---
echo.
echo ## ⚡ Concurrency ^& Race Condition Defense
echo.
echo 1. **Atomic Seat Decrements:** Instead of standard "Read-then-Write" operations ^(`findById` -^> `if check` -^> `save`^), which can cause overbooking during rapid parallel requests, the system utilizes an atomic `findOneAndUpdate` statement:
echo    ```javascript
echo    { _id: eventId, availableSeats: { $gt: 0 } }, { $inc: { availableSeats: -1 } }
echo    ```
echo    This ensures that MongoDB checks and reserves the seat in a single un-interruptible database thread transaction.
echo 2. **Idempotency ^& Duplicate Prevention:** A **Compound Unique Index** `{ eventId: 1, userName: 1 }` is enabled on the Registration Schema. If a user tries to double-click or issue duplicate requests, MongoDB throws a strict `E11000` error.
echo 3. **Data Integrity Rollback:** If a seat is successfully decremented but the subsequent registration fails due to a duplication restriction, the `catch` block performs an immediate atomic rollback ^(`$inc: { availableSeats: 1 }`^), ensuring 100%% seat tracking accuracy.
echo.
echo ---
echo.
echo ## 📊 Comprehensive Test Report ^(PowerShell Verified^)
echo.
echo All aspects of the application have been thoroughly tested via terminal-based integration testing scripts.
echo.
echo ^| Test ID ^| Scenario ^| Expected Result ^| Status ^| Details / Logs Caught ^|
echo ^| :---: ^| :--- ^| :--- ^| :---: ^| :--- ^|
echo ^| **1.1** ^| Create Event ^(Valid Data^) ^| Event creates with `availableSeats = totalSeats` ^| **✅ PASSED** ^| Event created successfully ^|
echo ^| **1.2** ^| Create Event ^(Duplicate Name^) ^| Strict rejection via database layer ^| **✅ PASSED** ^| Error: `"Event name must be unique"` ^|
echo ^| **1.3** ^| Create Event ^(Past Date^) ^| Custom validation schema trigger ^| **✅ PASSED** ^| Error: `"Event date must be in the future"` ^|
echo ^| **2.0** ^| Successful Registration ^| Seats decrement correctly dynamically ^| **✅ PASSED** ^| `availableSeats` moved 100 → 99 atomically ^|
echo ^| **3.0** ^| Duplicate User Registration ^| Second parallel request blocked ^| **✅ PASSED** ^| Error: `"User already registered for this event"` ^|
echo ^| **3.1** ^| Verify Seats After Duplication ^| Rollback works, data integrity maintained ^| **✅ PASSED** ^| `availableSeats` safely stayed at 99 ^(No leaks^) ^|
echo ^| **4.0** ^| Cancel Registration ^| Status turns `cancelled`, seat returns ^| **✅ PASSED** ^| Status updated successfully ^|
echo ^| **4.1** ^| Verify Seat After Cancellation^| Seat safely added back to the pool ^| **✅ PASSED** ^| `availableSeats` moved 99 → 100 atomically ^|
echo.
echo ---
echo.
echo ## ⚙️ Getting Started ^& Installation
echo.
echo ### Prerequisite
echo Ensure you have **Node.js** and **MongoDB** installed and running on your local machine.
echo.
echo ### 1. Environment Configurations
echo Create a `.env` file in the root directory:
echo ```env
echo PORT=5000
echo MONGO_URI=mongodb://localhost:27017/event_registration_db
echo ```
echo.
echo ### 2. Setup Dependencies
echo ```bash
echo npm install
echo ```
echo.
echo ### 3. Run the Server
echo For standard runtime:
echo ```bash
echo npm start
echo ```
echo For Development ^(Auto-refresh via Nodemon^):
echo ```bash
echo npm run dev
echo ```
echo.
echo ---
echo *Developed with ❤️ as a submission for the Innovaxel Backend Developer Intern position.*
) > README.md

echo ===================================================
echo README.md Created Successfully with perfect formatting!
echo ===================================================
pause
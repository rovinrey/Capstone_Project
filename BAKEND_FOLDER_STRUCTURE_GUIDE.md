# 📦 Backend Folder Structure (Node.js + Express)

This backend follows a clean and scalable architecture using Node.js and Express.

It separates responsibilities into:
- Routes
- Controllers
- Services
- Models
- Config

---

# 📁 Project Structure

```
backend/
│
├── node_modules/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── migrations.sql
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── program.controller.js
│   │   ├── form.controller.js
│   │   ├── beneficiary.controller.js  # previously logic inside routes
│   │   └── application.controller.js  # may be removed if unused
│   │
│   ├── models/
│   │   ├── (deprecated) TupadProfile.js
│   │   ├── (deprecated) DilpProfile.js
│   │   └── (deprecated) SPESprofile.js
│   │   # database logic has been moved to services/ -- these files
│   │   # are kept only for reference and can be deleted later.
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── beneficiary.routes.js
│   │   ├── attendance.routes.js
│   │   ├── form.routes.js
│   │   └── program.routes.js
│   │
│   ├── services/
│   │   ├── auth.services.js
│   │   ├── user.services.js
│   │   ├── beneficiary.services.js
│   │   ├── attendance.services.js
│   │   └── dilp.services.js
│
├── .env
├── server.js (or app.js)
└── package.json
```

---

# 🧠 Architecture Overview

This backend uses a layered architecture:

```
Client
   ↓
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models / Database
```

Each layer has a specific responsibility.

---

# 📁 Folder Explanation

## 1️⃣ config/

### db.js
- Handles database connection
- Exports database instance

### migrations.sql
- Contains SQL table creation scripts
- Used to initialize database structure

---

## 2️⃣ routes/

Routes define API endpoints.

Example:
```js
router.post("/login", loginUser);
```

Routes:
- Receive HTTP request
- Call controller function
- Do NOT contain business logic

Example mounting in `server.js`:

```js
app.use("/api/auth", authRoutes);
```

Full endpoint becomes:

```
POST /api/auth/login
```

---

## 3️⃣ controllers/

Controllers:
- Handle request and response
- Call services
- Return JSON response

Example:

```js
exports.loginUser = async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
};
```

Controllers should NOT contain:
- Database queries
- Complex logic

---

## 4️⃣ services/

Services contain business logic.

They:
- Talk to the database
- Process data
- Validate business rules

Example:

```js
exports.login = async (data) => {
  const user = await UserModel.findByEmail(data.email);
  // password validation logic
  return user;
};
```

---

## 5️⃣ models/

Models represent database tables.

Example:
- TupadProfile
- DilpProfile
- SPEProfile

They define:
- Table structure
- Database queries
- ORM schema (if using Sequelize/Mongoose)

---

## 6️⃣ .env

Contains environment variables:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
JWT_SECRET=supersecretkey
```

⚠️ Never commit this file to GitHub.

---

# 🔁 How Everything Interacts (Request Flow)

Example: Register TUPAD Beneficiary

### Step 1 – Client Request

```
POST /api/tupad/register
```

### Step 2 – Route

`tupad.routes.js`

```js
router.post("/register", registerTupad);
```

### Step 3 – Controller

`tupad.controller.js`

```js
exports.registerTupad = async (req, res) => {
  const result = await tupadService.register(req.body);
  res.status(201).json(result);
};
```

### Step 4 – Service

`tupad.services.js`

```js
exports.register = async (data) => {
  return await TupadProfile.create(data);
};
```

### Step 5 – Model

`TupadProfile.js`

- Inserts data into database table

---

# 🎯 Why This Structure Is Good

✅ Clear separation of concerns  
✅ Easy to maintain  
✅ Easy to scale  
✅ Professional structure  
✅ Clean for capstone or production  

---

# 🚀 Optional Improvements

You can improve this structure by adding:

```
middlewares/
validators/
utils/
tests/
```

Example:

- auth.middleware.js
- role.middleware.js
- validation schemas
- reusable helper functions

---

# 📌 Summary

| Layer       | Responsibility |
|------------|---------------|
| Routes      | Define API endpoints |
| Controllers | Handle request/response |
| Services    | Business logic |
| Models      | Database interaction |
| Config      | Setup and configuration |

---

# 🏁 Final Architecture Diagram

```
Frontend (React / HTML / Mobile App)
            ↓
        Express API
            ↓
         Routes
            ↓
       Controllers
            ↓
         Services
            ↓
        Database
```

---

This structure is ideal for:

- TUPAD Management System
- Pangkabuhayan (DILP) System
- Beneficiary Tracking
- Attendance Monitoring
- Payroll Processing
# Full Stack Approve/Reject Implementation - Setup & Testing

## ✅ Implementation Status

### Backend Implementation
- ✅ Service functions added to `beneficiary.services.js`
  - `getPendingApplications()`
  - `getApplicationsByStatus(status)`
  - `approveApplication(id)`
  - `rejectApplication(id, reason)`

- ✅ Controller functions added to `form.controller.js`
  - `getPendingApplications()`
  - `getApplicationsByStatus()`
  - `approveApplication()`
  - `rejectApplication()`

- ✅ Routes added to `form.routes.js`
  - `GET /api/forms/applications/pending`
  - `GET /api/forms/applications?status={status}`
  - `PUT /api/forms/applications/:id/approve`
  - `PUT /api/forms/applications/:id/reject`

- ✅ Database migrations ready in `migrations.sql`
  - Columns: status, created_at, updated_at, approval_date, rejection_reason

### Frontend Implementation
- ✅ AdminDashboard component has:
  - Approve button (green with checkmark)
  - Reject button (red with X)
  - Loading spinner during processing
  - Auto-refresh after action
  - Error handling with alerts

- ✅ ApplicationApproval component has:
  - Filter tabs for status filtering
  - Disable buttons for non-pending apps
  - Full approval workflow

---

## 🚀 Quick Start Guide

### Step 1: Database Setup
```bash
cd c:\Users\Rovin Rey\Desktop\capstone
```

Open your MySQL client and run:
```sql
-- Run all migrations to set up required columns
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Pending';

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS approval_date TIMESTAMP NULL;

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT NULL;

CREATE INDEX IF NOT EXISTS idx_status ON applications(status);
```

### Step 2: Start Backend
```bash
cd backend
npm run dev
# Expected output: 🚀 Server live at http://localhost:5000
```

### Step 3: Start Frontend
Open new terminal:
```bash
cd frontend
npm run dev
# Expected output: Local: http://localhost:5173
```

---

## 🧪 Testing Endpoints

### Test 1: Fetch Pending Applications
```bash
curl -X GET "http://localhost:5000/api/forms/applications/pending"
```
Expected: Array of pending applications

### Test 2: Fetch Applications by Status
```bash
curl -X GET "http://localhost:5000/api/forms/applications?status=Pending"
```
Expected: Array of pending applications

### Test 3: Approve Application
```bash
curl -X PUT "http://localhost:5000/api/forms/applications/1/approve" \
  -H "Content-Type: application/json"
```
Expected: `{ "message": "Application approved successfully" }`

### Test 4: Reject Application
```bash
curl -X PUT "http://localhost:5000/api/forms/applications/2/reject" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Missing documents"}'
```
Expected: `{ "message": "Application rejected successfully" }`

---

## 📱 UI Testing

### AdminDashboard Testing:
1. Navigate to Admin Dashboard
2. Look for "Recent Applications" table
3. For each pending application, you should see:
   - Applicant name
   - Program type
   - Contact number
   - Occupation
   - Monthly income
   - Status badge
   - **Approve** button (green)
   - **Reject** button (red)

4. Click **Approve**:
   - Button shows loading spinner
   - Server processes request
   - Alert appears: "Application approved successfully!"
   - List refreshes

5. Click **Reject**:
   - Prompt appears for rejection reason
   - Button shows loading spinner
   - Server processes request
   - Alert appears: "Application rejected successfully"
   - List refreshes

### ApplicationApproval Testing:
1. Navigate to Application Approval page
2. Click on "Pending" tab (default)
3. Verify pending applications display
4. Click **Approve** (green checkmark):
   - Loading spinner appears
   - Application removed from list
   - Can switch to "Approved" tab to see it
5. Click **Reject** (red X):
   - Reason prompt appears
   - Application removed from list
   - Can switch to "Rejected" tab to see it

---

## 🔍 Database Verification

Check if updates worked:
```sql
-- View application with Approved status
SELECT id, first_name, last_name, status, approval_date, created_at 
FROM applications 
WHERE id = 1;

-- View application with Rejected status and reason
SELECT id, first_name, last_name, status, rejection_reason, approval_date 
FROM applications 
WHERE id = 2;

-- Count by status
SELECT status, COUNT(*) as count 
FROM applications 
GROUP BY status;
```

---

## ⚠️ Common Errors & Fixes

### Error: "Cannot GET /api/forms/applications/pending"
- **Cause:** Routes not properly added to form.routes.js
- **Fix:** Verify all 4 routes are added to form.routes.js and mounted in server.js

### Error: "Application ID is required"
- **Cause:** ID parameter not being passed correctly
- **Fix:** Ensure frontend sends ID in URL path: `/applications/{id}/approve`

### Error: "Unknown column 'status' in field list"
- **Cause:** Database migrations not run
- **Fix:** Run all migrations.sql statements in MySQL

### Error: CORS error when calling API
- **Cause:** CORS not enabled
- **Fix:** Verify `app.use(cors())` is in server.js before routes

### Error: "Cannot read property 'getPendingApplications'"
- **Cause:** Service functions not exported or imported
- **Fix:** Verify exports in beneficiaryService.js and require in controller

---

## 📋 Complete File Checklist

- [x] `backend/server.js` - Routes mounted correctly
- [x] `backend/src/config/db.js` - Database connection configured
- [x] `backend/src/services/beneficiary.services.js` - Approval functions added
- [x] `backend/src/controllers/form.controller.js` - Approval endpoints added
- [x] `backend/src/routes/form.routes.js` - Approval routes added
- [x] `backend/src/config/migrations.sql` - Schema prepared
- [x] `frontend/src/components/navigation/AdminDashboard.tsx` - Buttons implemented
- [x] `frontend/src/components/navigation/ApplicationApproval.tsx` - Filter and approval logic
- [x] `frontend/package.json` - axios included (for API calls)

---

## 📞 Support

If you encounter issues:

1. **Check backend logs** - Terminal where `npm run dev` is running
2. **Check frontend console** - Browser DevTools > Console tab
3. **Verify database** - Ensure columns exist and data is present
4. **Check network tab** - Browser DevTools > Network to see API calls

---

## 🎉 Next Steps

Once verified working:
1. Add email notifications on approval/rejection
2. Add audit log for approval history
3. Add comments/notes field for admin feedback
4. Implement bulk approval feature
5. Add approval workflow with multiple levels
6. Add beneficiary creation on approval


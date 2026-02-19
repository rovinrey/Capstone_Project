# Full Stack Approve/Reject Application Function

## Overview
Complete end-to-end implementation for approving and rejecting beneficiary applications across frontend, backend, and database layers.

---

## 🗄️ DATABASE LAYER

### Schema Setup
**File:** `backend/src/config/migrations.sql`

Required columns in `applications` table:
- `status` VARCHAR(20) - DEFAULT: 'Pending' (Pending, Approved, Rejected)
- `created_at` TIMESTAMP - When application was submitted
- `updated_at` TIMESTAMP - When application was last modified
- `approval_date` TIMESTAMP - When approved/rejected
- `rejection_reason` TEXT - Optional reason for rejection

```sql
-- Run this migration in your MySQL database
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

---

## 🔧 BACKEND LAYER

### Service Functions
**File:** `backend/src/services/beneficiary.services.js`

```javascript
// Get pending applications
exports.getPendingApplications = async () => {
    const query = `
        SELECT id, first_name, middle_name, last_name, program_type, 
               contact_number, occupation, monthly_income, status, created_at
        FROM applications 
        WHERE status = 'Pending'
        ORDER BY created_at DESC
    `;
    return await db.execute(query);
};

// Get applications by status (Pending, Approved, Rejected)
exports.getApplicationsByStatus = async (status) => {
    const query = `
        SELECT id, first_name, middle_name, last_name, program_type, 
               contact_number, occupation, monthly_income, status, created_at
        FROM applications 
        WHERE status = ?
        ORDER BY created_at DESC
    `;
    return await db.execute(query, [status]);
};

// Approve application - Sets status to Approved and records approval date
exports.approveApplication = async (id) => {
    const query = `
        UPDATE applications 
        SET status = 'Approved', approval_date = NOW(), updated_at = NOW()
        WHERE id = ?
    `;
    return await db.execute(query, [id]);
};

// Reject application - Sets status to Rejected with optional reason
exports.rejectApplication = async (id, reason = null) => {
    const query = `
        UPDATE applications 
        SET status = 'Rejected', rejection_reason = ?, approval_date = NOW(), updated_at = NOW()
        WHERE id = ?
    `;
    return await db.execute(query, [reason, id]);
};
```

### Controller Functions
**File:** `backend/src/controllers/form.controller.js`

```javascript
// Get pending applications endpoint
exports.getPendingApplications = async (req, res) => {
    try {
        const [applications] = await beneficiaryService.getPendingApplications();
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching pending applications:", error.message);
        res.status(500).json({ message: "Error fetching pending applications", error: error.message });
    }
};

// Get applications by status endpoint
exports.getApplicationsByStatus = async (req, res) => {
    try {
        const { status } = req.query;
        
        if (!status) {
            return res.status(400).json({ message: "Status parameter is required" });
        }
        
        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be Pending, Approved, or Rejected" });
        }
        
        const [applications] = await beneficiaryService.getApplicationsByStatus(status);
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications by status:", error.message);
        res.status(500).json({ message: "Error fetching applications", error: error.message });
    }
};

// Approve application endpoint
exports.approveApplication = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "Application ID is required" });
        }
        
        await beneficiaryService.approveApplication(id);
        res.status(200).json({ message: "Application approved successfully" });
    } catch (error) {
        console.error("Error approving application:", error.message);
        res.status(500).json({ message: "Error approving application", error: error.message });
    }
};

// Reject application endpoint
exports.rejectApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        
        if (!id) {
            return res.status(400).json({ message: "Application ID is required" });
        }
        
        await beneficiaryService.rejectApplication(id, reason || null);
        res.status(200).json({ message: "Application rejected successfully" });
    } catch (error) {
        console.error("Error rejecting application:", error.message);
        res.status(500).json({ message: "Error rejecting application", error: error.message });
    }
};
```

### API Routes
**File:** `backend/src/routes/form.routes.js`

```javascript
// Application approval routes
router.get('/applications/pending', formController.getPendingApplications);
router.get('/applications', formController.getApplicationsByStatus);
router.put('/applications/:id/approve', formController.approveApplication);
router.put('/applications/:id/reject', formController.rejectApplication);
```

---

## 💻 FRONTEND LAYER

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/forms/applications/pending` | Fetch all pending applications |
| GET | `/api/forms/applications?status=STATUS` | Fetch applications by status |
| PUT | `/api/forms/applications/:id/approve` | Approve an application |
| PUT | `/api/forms/applications/:id/reject` | Reject an application (with optional reason) |

### AdminDashboard Component
**File:** `frontend/src/components/navigation/AdminDashboard.tsx`

Features:
- Shows recent applications in a table
- **Approve button** (green) - Approves application
- **Reject button** (red) - Rejects with optional reason prompt
- Auto-refresh after action
- Loading spinner during processing
- Disabled state to prevent duplicate clicks

```tsx
const handleApproveApplication = async (applicationId: number) => {
    setProcessingId(applicationId);
    try {
        const response = await axios.put(
            `http://localhost:5000/api/forms/applications/${applicationId}/approve`
        );
        
        if (response.status === 200) {
            alert("Application approved successfully!");
            fetchRecentApplications();
        }
    } catch (err: any) {
        console.error("Error approving application:", err);
        alert("Failed to approve application");
    } finally {
        setProcessingId(null);
    }
};

const handleRejectApplication = async (applicationId: number) => {
    const reason = prompt("Enter rejection reason (optional):");
    setProcessingId(applicationId);
    
    try {
        const response = await axios.put(
            `http://localhost:5000/api/forms/applications/${applicationId}/reject`,
            { reason: reason || null }
        );
        
        if (response.status === 200) {
            alert("Application rejected successfully");
            fetchRecentApplications();
        }
    } catch (err: any) {
        console.error("Error rejecting application:", err);
        alert("Failed to reject application");
    } finally {
        setProcessingId(null);
    }
};
```

### ApplicationApproval Component
**File:** `frontend/src/components/navigation/ApplicationApproval.tsx`

Advanced approval interface with:
- Filter tabs (Pending, Approved, Rejected)
- Full application details display
- Icon buttons for approve/reject
- Only shows action buttons for pending applications
- Real-time status updates

---

## 🚀 SETUP INSTRUCTIONS

### 1. Database Setup
Run the migration SQL on your MySQL database:
```bash
mysql -u your_user -p your_database < backend/src/config/migrations.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📊 DATA FLOW

### Approve Application Flow:
1. Admin clicks **Approve** button on AdminDashboard or ApplicationApproval
2. Frontend sends: `PUT /api/forms/applications/{id}/approve`
3. Backend controller validates ID
4. Service layer updates database:
   - Sets `status = 'Approved'`
   - Sets `approval_date = NOW()`
   - Sets `updated_at = NOW()`
5. Frontend receives success response
6. Application list refreshes
7. Admin sees confirmation message

### Reject Application Flow:
1. Admin clicks **Reject** button
2. Browser prompt asks for rejection reason (optional)
3. Frontend sends: `PUT /api/forms/applications/{id}/reject` with reason in body
4. Backend controller validates ID
5. Service layer updates database:
   - Sets `status = 'Rejected'`
   - Sets `rejection_reason = {reason}`
   - Sets `approval_date = NOW()`
   - Sets `updated_at = NOW()`
6. Frontend receives success response
7. Application list refreshes
8. Admin sees confirmation message

---

## ✅ Testing Checklist

- [ ] Database migrations applied successfully
- [ ] Backend server running on port 5000
- [ ] Frontend running on localhost:5173 (or configured port)
- [ ] GET `/api/forms/applications/pending` returns pending apps
- [ ] PUT `/api/forms/applications/:id/approve` updates status to Approved
- [ ] PUT `/api/forms/applications/:id/reject` updates status to Rejected
- [ ] AdminDashboard buttons work correctly
- [ ] ApplicationApproval page filters work correctly
- [ ] Success/error alerts display properly
- [ ] Database columns are created

---

## 🔍 Troubleshooting

**Issue:** 404 error when calling approval endpoints
- **Solution:** Ensure routes are added to `form.routes.js` and mounted in `server.js`

**Issue:** Database columns not found
- **Solution:** Run migrations.sql file against your MySQL database

**Issue:** CORS errors when calling API
- **Solution:** Verify CORS is enabled in backend `server.js`

**Issue:** Status not updating in database
- **Solution:** Check that application ID exists in database, verify `status` column exists

---

## 📝 Notes

- All timestamps are recorded automatically via MySQL CURRENT_TIMESTAMP
- Rejection reason is optional and stored for audit trail
- Status validation ensures only valid statuses are used
- Applications can transition from Pending → Approved or Pending → Rejected
- Once rejected/approved, buttons only show in filtered views


# Security Configuration & Production Deployment

## 🔒 Critical: HTTPS/Mixed Content Fix

### Problem
Frontend on Vercel (HTTPS) was calling backend with HTTP, causing Mixed Content errors:
```
The page at 'https://peso-juban.vercel.app' was loaded over HTTPS, 
but requested an insecure XMLHttpRequest endpoint 'http://...'. 
This request has been blocked.
```

### Solution
- Backend on Railway serves content over HTTPS (automatically)
- Frontend API calls now use HTTPS URLs in production
- API URL configured via environment variables

---

## 📋 Environment Variables Setup

### Vercel Frontend Deployment

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Add this variable:
   ```
   VITE_API_URL = https://serverside-production-9b74.up.railway.app
   ```

3. Apply to: **Production** environment

4. Redeploy the frontend after adding the variable

### Railway Backend Deployment

1. Go to **Railway Dashboard** → Your Project → **Backend Service** → **Variables**

2. Railway automatically provides:
   - `MYSQLHOST`
   - `MYSQLPASSWORD`
   - `MYSQLUSER`
   - `MYSQLPORT`
   - `MYSQLDATABASE`

3. Add these manually:
   ```
   NODE_ENV=production
   PORT=8080
   JWT_SECRET=<generate-a-strong-random-secret>
   CORS_ORIGIN=https://peso-juban.vercel.app,https://<other-domains>
   ```

---

## 🔐 Secret Management Best Practices

### ✅ DO:
- [ ] Store secrets in Railway/Vercel dashboards, NOT in code
- [ ] Use `.env.example` to document required variables
- [ ] Keep `.env` files in `.gitignore` (already configured)
- [ ] Rotate JWT_SECRET regularly in production
- [ ] Use HTTPS everywhere in production
- [ ] Set `NODE_ENV=production` on production servers

### ❌ DON'T:
- [ ] Commit `.env` files to git
- [ ] Hardcode API keys, JWT secrets, or passwords
- [ ] Use HTTP in production (causes Mixed Content errors)
- [ ] Expose secrets in error messages or logs
- [ ] Share production `.env` files via email/Slack

---

## 🛡️ Security Headers

### Implemented:
- **HSTS (HTTP Strict Transport Security)**: Forces HTTPS in production
- **Helmet.js**: Protects against XSS, clickjacking, and other attacks
- **CORS**: Whitelisted origins only
- **Rate Limiting**: 1000 requests per 15 minutes
- **Content Security Policy**: Enforced via Helmet

---

## 🚀 Local Development

1. Create `.env` file in backend root:
   ```env
   NODE_ENV=development
   PORT=8080
   MYSQLHOST=localhost
   MYSQLUSER=root
   MYSQLPASSWORD=
   MYSQLDATABASE=capstone_db
   MYSQLPORT=3306
   JWT_SECRET=dev-secret-key-min-32-characters
   CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175
   ```

2. Create `.env` file in frontend root:
   ```env
   VITE_API_URL=http://localhost:8080
   ```

3. Start both services:
   ```bash
   # Terminal 1: Backend
   cd backend
   npm install
   npm start

   # Terminal 2: Frontend
   cd frontend
   npm install
   npm run dev
   ```

---

## 📝 Environment Variable Reference

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `NODE_ENV` | Yes | `production` | Enables production optimizations |
| `PORT` | Yes | `8080` | Backend server port |
| `VITE_API_URL` | Yes | `https://...railway.app` | Frontend → Backend URL (MUST be HTTPS in production) |
| `JWT_SECRET` | Yes | `min-32-char-random-string` | JWT token signing key |
| `CORS_ORIGIN` | Yes | `https://peso-juban.vercel.app` | Allowed frontend domains |
| `MYSQLHOST` | Yes | `mysql.railway.internal` | Database host |
| `MYSQLUSER` | Yes | `root` | Database user |
| `MYSQLPASSWORD` | Yes | `generated-password` | Database password |
| `MYSQLDATABASE` | Yes | `capstone_db` | Database name |
| `MYSQLPORT` | Yes | `3306` | Database port |

---

## 🔍 Verification Checklist

- [ ] Frontend loads over HTTPS in production
- [ ] `VITE_API_URL` in Vercel uses HTTPS
- [ ] No Mixed Content errors in browser console
- [ ] Backend responds with HSTS headers
- [ ] CORS headers allow only whitelisted origins
- [ ] No `.env` files committed to git
- [ ] Rate limiting working (tested with many requests)
- [ ] JWT_SECRET is strong and unique per environment

---

## 🆘 Troubleshooting

### "Mixed Content" Error
- **Cause**: Frontend on HTTPS calling HTTP API
- **Fix**: Ensure `VITE_API_URL` starts with `https://` in production

### CORS Errors
- **Cause**: Frontend origin not in `CORS_ORIGIN` list
- **Fix**: Add the exact frontend URL to `CORS_ORIGIN` in backend environment variables

### Database Connection Errors
- **Cause**: Wrong credentials or offline database
- **Fix**: Verify all MYSQL* variables in Railway dashboard match your database

### Rate Limit Errors
- **Cause**: Too many requests (>1000 per 15 min)
- **Fix**: Space out requests or optimize client-side logic

---

**Last Updated**: April 20, 2026  
**Status**: ✅ Production Ready

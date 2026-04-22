# Security Checklist - Before Committing to GitHub

## ✅ Pre-Commit Verification

Run these checks before pushing to GitHub to ensure NO secrets are exposed:

### 1. Verify `.env` files are gitignored
```bash
# This should return NOTHING - meaning .env files are properly ignored
git status | grep "\.env"
```

### 2. Check committed files don't contain secrets
```bash
# Search for common secret patterns
git diff --cached | grep -i "password\|secret\|token\|key" || echo "✅ No secrets found"
```

### 3. Verify no credentials in config.js
```bash
# config.js should NOT contain hardcoded passwords, usernames, or connection strings
grep -E "password|MYSQL|root|localhost" backend/config.js | grep -v "process.env" || echo "✅ No hardcoded secrets"
```

### 4. Verify only examples are committed
```bash
# These SHOULD exist and be committed
ls -la backend/.env.example
ls -la frontend/.env.example

# These should NOT be in git
git ls-files | grep "\.env$" && echo "❌ ERROR: .env file is committed!" || echo "✅ .env not committed"
```

## 🔒 What's Protected

### Ignored (.gitignore protects these)
```
.env
.env.development
.env.production
.env.local
.env*.local
node_modules/
```

### Committed (Safe - no secrets)
```
.env.example           ✅ Template only
config.js              ✅ Uses env vars only
env.config.js          ✅ Validates env vars only
CONFIG_GUIDE.md        ✅ Documentation only
SECURITY_CHECKLIST.md  ✅ This file
```

## 🛡️ Environment Variable Security

### Development Variables (Can be in .env locally)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<your-local-password>
DB_DATABASE=capstone_db
```

### Production Variables (NEVER in repo)
```
MYSQLHOST=<railway-provided>
MYSQLUSER=<railway-provided>
MYSQLPASSWORD=<railway-provided>
MYSQLDATABASE=<railway-provided>
JWT_SECRET=<your-strong-32-char-secret>
```

## 📋 Secrets You Must Generate

| Secret | Length | How to Generate | Where to Store |
|--------|--------|-----------------|-----------------|
| `JWT_SECRET` | 32+ chars | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | Railway dashboard |
| `DB_PASSWORD` (dev) | Variable | Use strong local password | `.env` (local only) |

## 🚨 If a Secret is Ever Exposed

1. **Immediately regenerate** the secret
2. **Rotate all credentials** that were exposed
3. **Check git history** - secrets may need cleanup:
   ```bash
   git log -p -- backend/config.js | grep -i password
   ```
4. **Use git-filter-repo** to remove from history (if needed):
   ```bash
   npm run clean:git-history
   ```

## ✅ Security Review Checklist

Before marking code as ready for production:

- [ ] No `.env` files are committed
- [ ] No hardcoded passwords in any JavaScript files
- [ ] `JWT_SECRET` is 32+ characters
- [ ] All database credentials come from `process.env`
- [ ] Production URLs don't contain credentials
- [ ] `NODE_ENV=production` is set in Railway
- [ ] CORS origins are correctly configured
- [ ] Rate limiting is enabled in production
- [ ] Helmet security headers are enabled
- [ ] All third-party credentials are in environment variables

## 🔍 Review Files

Before committing, review:
1. `backend/config.js` - Should only have env references
2. `backend/env.config.js` - Should only validate, not contain secrets
3. `.gitignore` - Should include all .env* patterns

## 📞 If You Find an Issue

1. Don't panic - .gitignore protects most mistakes
2. Check if file is already in git: `git ls-files backend/.env`
3. If yes, use: `git rm --cached backend/.env` then commit
4. Regenerate any exposed credentials in production

---

**Remember:** The security of this application depends on keeping secrets SECRET. 🔐

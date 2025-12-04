# Build Troubleshooting Guide

## Error: "JavaScript heap out of memory"

### Root Causes
1. **Missing or invalid `GOOGLE_SERVICE_ACCOUNT_JSON` environment variable** - causes type inference failures
2. **Complex type definitions from googleapis library** - triggers TypeScript memory bloat
3. **Insufficient Node.js heap size** during build
4. **Circular import dependencies**

### Solutions Applied

#### 1. ✅ Simplified Type System
- Removed complex `ReturnType<typeof google.drive>` type inference
- Used minimal interfaces for Drive API responses
- Avoided direct `JWT` type imports (used `require` instead)

#### 2. ✅ Increased Node Heap Memory
Updated `package.json` build script:
```json
"build": "node --max-old-space-size=4096 ./node_modules/.bin/next build"
```
This allocates 4GB of heap memory instead of default ~2GB.

#### 3. ✅ TypeScript Configuration
- Added `forceConsistentCasingInFileNames: true`
- Ensured `skipLibCheck: true` (already set)
- Excluded `.next` folder from compilation

#### 4. ✅ Environment Setup
Create `.env.local` with:
```
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"YOUR_PROJECT","private_key":"-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----\n","client_email":"...@...iam.gserviceaccount.com"}
JWT_SECRET_REC=your_secret_key
```

### How to Test

1. **Clean build:**
   ```powershell
   Remove-Item -Path ".next" -Recurse -Force
   npm run build
   ```

2. **Monitor memory usage:**
   - The build should complete without "heap out of memory" errors
   - Takes 2-5 minutes depending on system specs

3. **If still failing:**
   ```powershell
   # Increase heap to 8GB
   $env:NODE_OPTIONS = "--max-old-space-size=8192"
   npm run build
   ```

### Additional Debug Steps

If the error persists:

1. **Verify googleapis is installed:**
   ```powershell
   npm list googleapis
   ```

2. **Clear cache:**
   ```powershell
   Remove-Item -Path "node_modules\.cache" -Recurse -Force
   Remove-Item -Path ".next" -Recurse -Force
   npm ci
   ```

3. **Check for lint errors:**
   ```powershell
   npm run lint 2>&1 | Select-Object -First 50
   ```

4. **Test API routes separately:**
   ```powershell
   npm run build -- --debug
   ```

### For Vercel Deployment

Add to `vercel.json`:
```json
{
  "buildCommand": "node --max-old-space-size=4096 ./node_modules/.bin/next build",
  "env": {
    "GOOGLE_SERVICE_ACCOUNT_JSON": "@google_service_account_json",
    "JWT_SECRET_REC": "@jwt_secret_rec"
  }
}
```

Then set environment variables in Vercel Project Settings.

### Prevention

- Always set `GOOGLE_SERVICE_ACCOUNT_JSON` before building
- Don't commit `.env.local` to version control
- Use `npm ci` for deterministic installs in CI/CD
- Monitor build logs for type-related warnings

### Resources

- [Next.js Memory Issues](https://github.com/vercel/next.js/discussions/38307)
- [Node.js Heap Size](https://nodejs.org/en/docs/guides/simple-profiling/)
- [TypeScript Performance](https://www.typescriptlang.org/docs/handbook/performance.html)

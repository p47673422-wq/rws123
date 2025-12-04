#!/usr/bin/env node

/**
 * Pre-build verification script
 * Checks for common issues that cause heap memory errors
 */

const fs = require('fs');
const path = require('path');

const checks = {
  envFile: false,
  googleServiceAccountSet: false,
  jwtSecretSet: false,
  typescriptConfig: false,
  googleDriveLib: false,
  authLib: false,
};

console.log('🔍 Running pre-build verification...\n');

// Check 1: .env.local exists
if (fs.existsSync(path.join(__dirname, '.env.local'))) {
  checks.envFile = true;
  console.log('✅ .env.local file found');

  const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  if (envContent.includes('GOOGLE_SERVICE_ACCOUNT_JSON=')) {
    checks.googleServiceAccountSet = true;
    console.log('✅ GOOGLE_SERVICE_ACCOUNT_JSON is set');
  } else {
    console.log('⚠️  GOOGLE_SERVICE_ACCOUNT_JSON not found in .env.local');
  }
} else {
  console.log('⚠️  .env.local not found - copy from .env.local.example');
}

// Check 2: TypeScript config
if (fs.existsSync(path.join(__dirname, 'tsconfig.json'))) {
  const tsconfig = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'tsconfig.json'), 'utf8')
  );
  if (tsconfig.compilerOptions.skipLibCheck) {
    checks.typescriptConfig = true;
    console.log('✅ TypeScript skipLibCheck enabled');
  }
}

// Check 3: Lib files exist
if (fs.existsSync(path.join(__dirname, 'src/lib/googleDrive.ts'))) {
  checks.googleDriveLib = true;
  console.log('✅ src/lib/googleDrive.ts exists');
}

if (fs.existsSync(path.join(__dirname, 'src/lib/auth.ts'))) {
  checks.authLib = true;
  console.log('✅ src/lib/auth.ts exists');
}

// Check 4: googleapis installed
try {
  require('googleapis');
  console.log('✅ googleapis package installed');
} catch (e) {
  console.log('❌ googleapis not installed: npm install googleapis');
}

console.log('\n📋 Summary:');
const allPassed = Object.values(checks).every(Boolean);

if (allPassed) {
  console.log('✅ All checks passed! Ready to build.');
  process.exit(0);
} else {
  console.log(
    '⚠️  Some checks failed. Please see messages above and fix issues.'
  );
  process.exit(1);
}

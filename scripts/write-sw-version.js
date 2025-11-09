const fs = require('fs');
const path = require('path');

const buildId = process.env.VERCEL_GIT_COMMIT_SHA || process.env.BUILD_ID || Date.now().toString();
const templatePath = path.resolve(__dirname, '..', 'public', 'sw.template.js');
const outPath = path.resolve(__dirname, '..', 'public', 'sw.js');

let content = fs.readFileSync(templatePath, 'utf8');
content = content.replace('__BUILD_ID__', buildId);
fs.writeFileSync(outPath, content, 'utf8');
console.log('Wrote sw.js with build id', buildId);

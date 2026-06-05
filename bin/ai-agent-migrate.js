#!/usr/bin/env node

const path = require('path');

// Check if the build exists
const distPath = path.join(__dirname, '..', 'dist', 'index.js');

try {
  require('fs').accessSync(distPath);
  // eslint-disable-next-line import/no-dynamic-require
  require(distPath);
} catch (e) {
  console.error('❌ Error: ai-agent-migrate is not built yet.');
  console.error('   Run: npm run build');
  process.exit(1);
}

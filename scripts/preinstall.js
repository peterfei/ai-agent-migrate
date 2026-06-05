#!/usr/bin/env node

const semver = require('semver');
const packageJson = require('../package.json');

const requiredNodeVersion = packageJson.engines.node;
const currentNodeVersion = process.version;

console.log(`🔍 Checking Node.js version...`);

if (!semver.satisfies(currentNodeVersion, requiredNodeVersion)) {
  console.error(`❌ Node.js version ${currentNodeVersion} is not supported.`);
  console.error(`   Required: ${requiredNodeVersion}`);
  console.error(`   Please upgrade your Node.js version.`);
  process.exit(1);
}

console.log(`✅ Node.js ${currentNodeVersion} is compatible.`);

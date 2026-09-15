#!/usr/bin/env node
// Fixora Developer/Owner First Admin Setup Utility
// Run: npm run setup-admin
// Or: node scripts/setup-admin.js <email> <password>

import crypto from 'node:crypto';
import readline from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';
import { db } from '../api/db.js';

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password).trim()).digest('hex');
}

async function prompt(question, hideText = false) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('\n======================================================');
  console.log('       FIXORA — DEVELOPER ADMIN ACCOUNT SETUP        ');
  console.log('======================================================');
  console.log('Configure your secure Administrator account for Fixora.');
  console.log('This sets the ADMIN role and stores credentials safely.\n');

  // Check command line arguments first
  const args = process.argv.slice(2);
  let email = args[0];
  let password = args[1];
  let name = args[2] || 'System Administrator';

  if (!email) {
    email = await prompt('Enter Admin Email ID: ');
  }

  if (!email || !email.includes('@')) {
    console.error('Error: A valid email address is required.');
    process.exit(1);
  }

  if (!password) {
    password = await prompt('Enter Admin Password (min 6 characters): ');
  }

  if (!password || password.length < 6) {
    console.error('Error: Admin password must be at least 6 characters long.');
    process.exit(1);
  }

  const cleanEmail = email.trim().toLowerCase();
  const passwordHash = hashPassword(password);

  // 1. Persist to Fixora Database
  const adminAccount = {
    id: `admin_dev_${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    role: 'admin',
    designation: 'Campus Operations Director & Developer',
    department: 'Central Administration',
    passwordHash: passwordHash,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=d97706`,
    phone: '+91 98100 00000',
    createdAt: new Date().toISOString()
  };

  await db.setAdmin(adminAccount);

  // 2. Also write/update .env.local for local development environment
  const envLocalPath = path.resolve(process.cwd(), '.env.local');
  let envContent = '';
  if (fs.existsSync(envLocalPath)) {
    envContent = fs.readFileSync(envLocalPath, 'utf-8');
  }

  // Update or append ADMIN_EMAIL and ADMIN_PASSWORD_HASH
  const lines = envContent.split('\n').filter(line => 
    !line.startsWith('ADMIN_EMAIL=') && 
    !line.startsWith('ADMIN_PASSWORD_HASH=') &&
    !line.startsWith('ADMIN_NAME=')
  );

  lines.push(`ADMIN_EMAIL=${cleanEmail}`);
  lines.push(`ADMIN_PASSWORD_HASH=${passwordHash}`);
  lines.push(`ADMIN_NAME=${name.trim()}`);

  fs.writeFileSync(envLocalPath, lines.join('\n').trim() + '\n', 'utf-8');

  console.log('\nSUCCESS! First Administrator account configured.');
  console.log('------------------------------------------------------');
  console.log(`Admin Email : ${cleanEmail}`);
  console.log(`Role        : ADMIN`);
  console.log(`Security    : Password hash saved securely to database & .env.local`);
  console.log('\nHow to log in:');
  console.log('1. Open Fixora ERP Login in your browser.');
  console.log('2. Click [ Admin ].');
  console.log(`3. Enter: ${cleanEmail}`);
  console.log('4. Enter your chosen password.');
  console.log('5. Click [ Authenticate as Administrator ].');
  console.log('======================================================\n');
}

main().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});

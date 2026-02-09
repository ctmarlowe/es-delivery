#!/usr/bin/env node

/**
 * Helper to properly format Prisma DATABASE_URL with URL encoding
 * Special characters in passwords must be URL-encoded
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Prisma Connection String Fixer');
console.log('─────────────────────────────────────\n');

console.log('Your connection details:');
console.log('  Public IP: 35.241.222.164');
console.log('  Username: postgres');
console.log('  Database: delivery-planner');
console.log('  Port: 5432\n');

rl.question('Enter your password: ', (password) => {
  // URL encode the password to handle special characters
  const encodedPassword = encodeURIComponent(password);
  
  // Build the connection string
  const connectionString = `postgresql://postgres:${encodedPassword}@35.241.222.164:5432/delivery-planner?sslmode=require`;
  
  console.log('\n✅ Properly formatted DATABASE_URL:');
  console.log('─'.repeat(80));
  console.log(connectionString);
  console.log('─'.repeat(80));
  
  console.log('\n📝 Add this to your .env file:');
  console.log(`DATABASE_URL="${connectionString}"\n`);
  
  console.log('💡 Common special characters that need encoding:');
  console.log('   @ → %40');
  console.log('   : → %3A');
  console.log('   / → %2F');
  console.log('   ? → %3F');
  console.log('   # → %23');
  console.log('   [ → %5B');
  console.log('   ] → %5D');
  console.log('   % → %25');
  console.log('   & → %26');
  console.log('   = → %3D\n');
  
  rl.close();
});

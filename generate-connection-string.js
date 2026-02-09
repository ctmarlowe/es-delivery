#!/usr/bin/env node

/**
 * Helper script to generate Prisma DATABASE_URL for Cloud SQL
 * Usage: node generate-connection-string.js
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const questions = [
  'Enter username (e.g., postgres): ',
  'Enter password: ',
  'Enter database name (e.g., delivery_plan): '
];

const answers = [];

function askQuestion(index) {
  if (index >= questions.length) {
    const [username, password, database] = answers;
    const publicIp = '35.241.222.164';
    const port = '5432';
    
    const connectionString = `postgresql://${username}:${password}@${publicIp}:${port}/${database}?sslmode=require`;
    
    console.log('\n✅ Your DATABASE_URL:');
    console.log('─'.repeat(80));
    console.log(connectionString);
    console.log('─'.repeat(80));
    console.log('\n📝 Add this to your .env file:');
    console.log(`DATABASE_URL="${connectionString}"\n`);
    
    rl.close();
    return;
  }

  // Hide password input
  if (index === 1) {
    rl.stdoutMuted = true;
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    let password = '';
    process.stdout.write(questions[index]);
    
    process.stdin.on('data', function(char) {
      char = char + '';
      switch(char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          answers.push(password);
          askQuestion(index + 1);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f':
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  } else {
    rl.question(questions[index], (answer) => {
      answers.push(answer);
      askQuestion(index + 1);
    });
  }
}

console.log('🔗 Cloud SQL Connection String Generator');
console.log('Public IP: 35.241.222.164\n');
askQuestion(0);

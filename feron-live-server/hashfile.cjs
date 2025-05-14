const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const filePath = path.join(__dirname, 'server.js');
const outputPath = path.join(__dirname, 'hashtags.txt');

const hash = crypto.createHash('sha256');
const stream = fs.createReadStream(filePath);

stream.on('data', (chunk) => {
  hash.update(chunk);
});

stream.on('end', () => {
  const fileHash = hash.digest('hex');
  const timestamp = new Date().toISOString();

  const output = `Timestamp: ${timestamp}\nSHA-256 hash of ${path.basename(filePath)}:\n${fileHash}\n\n`;
  fs.appendFileSync(outputPath, output);

  console.log(`Hash with timestamp appended to: ${outputPath}`);
});

stream.on('error', (err) => {
  console.error(`Error reading the file: ${err.message}`);
});

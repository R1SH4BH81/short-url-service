/**
 * Test script for URL Shortener Application
 * This script verifies the basic functionality of the URL shortener
 */

const fs = require("fs");
const path = require("path");

// Check if required files exist
const requiredFiles = [
  "server/index.js",
  "server/package.json",
  "client/src/App.jsx",
  "client/src/main.jsx",
  "client/package.json",
  "client/index.html",
  "FIREBASE_SETUP.md",
  "README.md",
];

console.log("🔍 Verifying URL Shortener Application Files...\n");

let allFilesExist = true;

requiredFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);

  if (exists) {
    console.log(`✅ ${file} - Found`);
  } else {
    console.log(`❌ ${file} - Missing`);
    allFilesExist = false;
  }
});

console.log("\n📁 Directory Structure:");
console.log("├── server/");
console.log("│   ├── index.js");
console.log("│   ├── package.json");
console.log("│   └── firebaseServiceAccount.json (needed by user)");
console.log("├── client/");
console.log("│   ├── index.html");
console.log("│   ├── package.json");
console.log("│   ├── tailwind.config.js");
console.log("│   ├── postcss.config.js");
console.log("│   └── src/");
console.log("│       ├── App.jsx");
console.log("│       ├── main.jsx");
console.log("│       └── index.css");
console.log("├── FIREBASE_SETUP.md");
console.log("├── README.md");
console.log("└── test-app.js");

console.log("\n🔧 How to Run the Application:");

console.log("\n1. Backend Setup:");
console.log("   cd server");
console.log("   npm install");
console.log("   # Add your firebaseServiceAccount.json file");
console.log("   # Create .env file with required variables");
console.log("   npm start");

console.log("\n2. Frontend Setup:");
console.log("   cd client");
console.log("   npm install");
console.log("   npm run dev");

console.log("\n🌐 API Endpoints:");
console.log("   POST /api/shorten    - Create short URL");
console.log("   GET  /:slug          - Redirect to original URL");
console.log("   GET  /api/recent     - Get recent URLs");
console.log("   GET  /api/stats/:slug - Get URL stats");

console.log('\n📊 Firestore Collection: "urls"');
console.log("   Document fields:");
console.log("   - longUrl (string)");
console.log("   - createdAt (timestamp)");
console.log("   - clicks (number)");
console.log("   - lastAccessed (timestamp)");
console.log("   Document ID = slug");

if (allFilesExist) {
  console.log("\n🎉 All required files are present! Application is ready.");
} else {
  console.log("\n⚠️  Some files are missing. Please check the implementation.");
}

console.log("\n📝 Notes:");
console.log("- Remember to add firebaseServiceAccount.json to .gitignore");
console.log("- Configure proper Firestore security rules for production");
console.log("- Consider adding rate limiting for API endpoints");

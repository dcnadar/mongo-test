import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

import dotenv from "dotenv";

dotenv.config();

// MongoDB Configuration
const folderName = process.env.FOLDER_NAME;

// Replace this with the actual JSON data or read it from a file
const jsonData = []

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Directory where JSON files will be saved
const targetDir = path.join(__dirname, folderName + '/grid');

// Create the directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Function to save each JSON object as a file
function saveJsonObjects(dataArray) {
    dataArray.forEach(obj => {
        const filePath = path.join(targetDir, `${obj._id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(obj, null, 4));
    });
}

// Save the JSON objects
saveJsonObjects(jsonData);

console.log('JSON files have been saved.');

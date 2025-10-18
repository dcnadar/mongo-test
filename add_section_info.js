import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';

dotenv.config();

// MongoDB Configuration
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const folderName = process.env.FOLDER_NAME;

export function save_file(collection, jsonData) {
  fs.writeFileSync(
    path.join(path.join(folderName, collection), `${jsonData._id}.json`),
    JSON.stringify(jsonData, null, 4)
  );
}

const client = new MongoClient(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const collectionName = "website_page_section_info";

async function run() {
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const content = {
      "reactGrid": "GlobalContentSection4",
      "thumb": "/static/themes/default/img/demo/content-section/ContentSection4.png",
      "theme": "global",
      "crmForm": "65d239b0197ecec46e8da820",
      "accountId": "5d6590b3af790ca2bcc707b7",
      "sectionTypeId": "65a7761687827874c7ebfe61",
      "status": "ACTIVE",
      "created": new Date(),
  };

    // Insert Content Model
    const contentResult = await collection.insertOne(content);
    content._id = contentResult.insertedId;
    save_file(collectionName, content);
    console.log("Content inserted with ID:", contentResult.insertedId);
  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    await client.close();
  }
}

run();

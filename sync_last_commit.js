import simpleGit from 'simple-git';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
const separator = path.sep;

dotenv.config();

const git = simpleGit();

const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const baseFolderName = process.env.FOLDER_NAME;

const client = new MongoClient(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath, (error) => {
      if (error) {
        console.error('Error deleting the file:', error.message);
        return;
      }
      console.log('File successfully deleted');
    });
  } catch (error) {
    console.error('Exception deleting the file:', error);
  }
}

async function updateMongoDBWithJsonFile(filePath, collectionName) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (jsonData._id) {
      // Convert _id from string to ObjectId
      const documentId = new ObjectId(jsonData._id);

      const filter = { _id: documentId };
      delete jsonData._id;

      if (!jsonData.created) {
        jsonData.created = new Date();
      } else {
        jsonData.created = new Date(jsonData.created);
      }

      const options = { upsert: true };

      const result = await collection.replaceOne(filter, jsonData, options);

      // const result = await collection.updateOne(
      //   { _id: documentId },
      //   { $set: updateData, $setOnInsert: { created: new Date() } },
      //   { upsert: true }
      // );

      if (result.matchedCount === 0) {
        console.log(`No document found with _id: ${documentId}`);
      } else {
        console.log(
          `Document updated in ${collectionName} with _id: ${documentId}`
        );
      }
    } else {
      // Add 'created' field for new documents
      jsonData.created = new Date();
      // Insert new document and save new JSON file
      const result = await collection.insertOne(jsonData);
      jsonData._id = result.insertedId;

      let collectionFolder = filePath.slice(0, filePath.lastIndexOf(separator));
      fs.writeFileSync(
        path.join(collectionFolder, `${result.insertedId}.json`),
        JSON.stringify(jsonData, null, 4)
      );
      console.log('created in ', collectionName, jsonData._id);
      deleteFile(filePath);
    }

    console.log(jsonData);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await client.close();
  }
}

async function getChangedFilesInLastCommit() {
  try {
    // Get the last commit hash
    const log = await git.log({ maxCount: 1 });
    if (!log || !log.latest) {
      throw new Error('No commits found in this repository.');
    }
    const lastCommitHash = log.latest.hash;

    // Get the diff summary for the last commit
    const diffSummary = await git.diffSummary([
      `${lastCommitHash}^`,
      lastCommitHash,
    ]);
    return diffSummary.files.map((file) => ({
      file: file.file,
      changes: file.changes,
      insertions: file.insertions,
      deletions: file.deletions,
    }));
  } catch (error) {
    console.error('Error fetching changed files:', error);
    throw error;
  }
}

async function main() {
  try {
    const changedFiles = await getChangedFilesInLastCommit();
    console.log('Changed files in the last commit:', changedFiles);
    let jsonFiles = changedFiles.filter(
      (file) =>
        file.file.endsWith('.json') && file.file.startsWith(baseFolderName + '/')
    );
    for (let jsonFile of jsonFiles) {
      const parts = jsonFile.file.split(separator);
      // Assuming the structure is 'sc_crm/collection_name/file.json'
      const collectionName = parts[1];
      await updateMongoDBWithJsonFile(jsonFile.file, collectionName);
    }
    console.log('invalidating changed files');
    fetch('http://super.trufal.in/api/public/memory/cache/invalidate').then(
      (d) => console.log(d.body)
    );
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
